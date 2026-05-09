import Product from "../../../models/Product.js";
import InventoryLog from "../../../models/InventoryLog.js";
import {
  validatePositiveStock,
  validateNonNegativeStock,
  validateThreshold,
} from "../../../utils/inventoryValidator.js";

// ─── Helper: compute stockStatus ──────────────────────────────────────────────
export const computeStockStatus = (stock, threshold) => {
  if (stock === 0) return "OUT_OF_STOCK";
  if (stock <= threshold) return "LOW_STOCK";
  return "IN_STOCK";
};

// ─── Add Stock ────────────────────────────────────────────────────────────────
export const addStockService = async (productId, vendorId, rawQty,) => {
  const qty = validatePositiveStock(rawQty);

  // fetch only needed fields — lightweight
  const before = await Product.findOne({ _id: productId, vendor: vendorId })
    .select("stock lowStockThreshold");

  if (!before) throw new Error("Product not found or unauthorized");

  // atomic $inc with $gte guard ;
  const updated = await Product.findOneAndUpdate(
    { _id: productId, vendor: vendorId },
    [
      {
        $set: {
          stock: { $add: ["$stock", qty] },
          stockStatus: {
            $switch: {
              branches: [
                {
                  case: { $eq: [{ $add: ["$stock", qty] }, 0] },
                  then: "OUT_OF_STOCK",
                },
                {
                  case: {
                    $lte: [{ $add: ["$stock", qty] }, "$lowStockThreshold"],
                  },
                  then: "LOW_STOCK",
                },
              ],
              default: "IN_STOCK",
            },
          },
        },
      },
    ],
    { new: true }
  );

  if (!updated) throw new Error("Stock update failed");

  await InventoryLog.create({
    product: productId,
    vendor: vendorId,
    change: +qty,
    reason: "MANUAL_ADD",
    stockBefore: before.stock,
    stockAfter: updated.stock,
  });

  return { stock: updated.stock, stockStatus: updated.stockStatus };
};

// ─── Reduce Stock ─────────────────────────────────────────────────────────────
export const reduceStockService = async (productId, vendorId, rawQty,) => {
  const qty = validatePositiveStock(rawQty);

  const before = await Product.findOne({ _id: productId, vendor: vendorId })
    .select("stock lowStockThreshold");

  if (!before) throw new Error("Product not found or unauthorized");
  if (before.stock < qty)
    throw new Error(`Insufficient stock. Available: ${before.stock}`);

  // $gte guard → stock can never go negative even with concurrent requests
  const updated = await Product.findOneAndUpdate(
    { _id: productId, vendor: vendorId, stock: { $gte: qty } },
    [
      {
        $set: {
          stock: { $subtract: ["$stock", qty] },
          stockStatus: {
            $switch: {
              branches: [
                {
                  case: { $eq: [{ $subtract: ["$stock", qty] }, 0] },
                  then: "OUT_OF_STOCK",
                },
                {
                  case: {
                    $lte: [
                      { $subtract: ["$stock", qty] },
                      "$lowStockThreshold",
                    ],
                  },
                  then: "LOW_STOCK",
                },
              ],
              default: "IN_STOCK",
            },
          },
        },
      },
    ],
    { new: true }
  );

  if (!updated)
    throw new Error("Insufficient stock (concurrent request blocked)");

  await InventoryLog.create({
    product: productId,
    vendor: vendorId,
    change: -qty,
    reason: "MANUAL_REDUCE",
    stockBefore: before.stock,
    stockAfter: updated.stock,
  });

  return { stock: updated.stock, stockStatus: updated.stockStatus };
};

// ─── Update Stock (set absolute value) ────────────────────────────────────────
export const updateStockService = async (productId, vendorId, rawStock,) => {
  const newStock = validateNonNegativeStock(rawStock);

  const before = await Product.findOne({ _id: productId, vendor: vendorId })
    .select("stock lowStockThreshold");

  if (!before) throw new Error("Product not found or unauthorized");

  const delta = newStock - before.stock;
  const stockStatus = computeStockStatus(newStock, before.lowStockThreshold);

  const updated = await Product.findOneAndUpdate(
    { _id: productId, vendor: vendorId },
    { $set: { stock: newStock, stockStatus } },
    { new: true }
  );

  if (!updated) throw new Error("Stock update failed");

  await InventoryLog.create({
    product: productId,
    vendor: vendorId,
    change: delta,
    reason: delta >= 0 ? "MANUAL_ADD" : "MANUAL_REDUCE",
    stockBefore: before.stock,
    stockAfter: newStock,
  });

  return { stock: updated.stock, stockStatus: updated.stockStatus };
};

// ─── Update Low Stock Threshold ────────────────────────────────────────────────
export const updateThresholdService = async (productId, vendorId, rawThreshold) => {
  const threshold = validateThreshold(rawThreshold);

  const product = await Product.findOneAndUpdate(
    { _id: productId, vendor: vendorId },
    [
      {
        $set: {
          lowStockThreshold: threshold,
          stockStatus: {
            $switch: {
              branches: [
                { case: { $eq: ["$stock", 0] }, then: "OUT_OF_STOCK" },
                { case: { $lte: ["$stock", threshold] }, then: "LOW_STOCK" },
              ],
              default: "IN_STOCK",
            },
          },
        },
      },
    ],
    { new: true }
  );

  if (!product) throw new Error("Product not found or unauthorized");

  return {
    lowStockThreshold: product.lowStockThreshold,
    stockStatus: product.stockStatus,
  };
};

// ─── Get Product Logs ─────────────────────────────────────────────────────────
export const getProductLogsService = async (productId, vendorId, page = 1, limit = 20) => {
  // verify ownership
  const product = await Product.findOne({ _id: productId, vendor: vendorId })
    .select("_id");
  if (!product) throw new Error("Product not found or unauthorized");

  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    InventoryLog.find({ product: productId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    InventoryLog.countDocuments({ product: productId }),
  ]);

  return { logs, total, page, totalPages: Math.ceil(total / limit) };
};

// ─── Get All Vendor Logs ──────────────────────────────────────────────────────
export const getVendorLogsService = async (vendorId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    InventoryLog.find({ vendor: vendorId })
      .populate("product", "name stockStatus")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    InventoryLog.countDocuments({ vendor: vendorId }),
  ]);

  return { logs, total, page, totalPages: Math.ceil(total / limit) };
};

// ─── Get Low Stock Alerts (vendor) ────────────────────────────────────────────
export const getLowStockService = async (vendorId) => {
  return await Product.find({
    vendor: vendorId,
    stockStatus: { $in: ["LOW_STOCK", "OUT_OF_STOCK"] },
  }).select("name stock stockStatus lowStockThreshold images");
};

// ─── Get All Vendor Inventory ──────────────────────────────────────────────────
export const getVendorInventoryService = async (vendorId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find({ vendor: vendorId })
      .select("name stock stockStatus lowStockThreshold price images")
      .sort({ stock: 1 }) // lowest stock first
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ vendor: vendorId }),
  ]);

  return { products, total, page, totalPages: Math.ceil(total / limit) };
};

// ─── ADMIN: All low/out of stock ──────────────────────────────────────────────
export const adminGetLowStockService = async () => {
  return await Product.find({
    stockStatus: { $in: ["LOW_STOCK", "OUT_OF_STOCK"] },
  })
    .populate("vendor", "name email")
    .select("name stock stockStatus lowStockThreshold vendor images")
    .sort({ stock: 1 });
};

// ─── ADMIN: All inventory logs ─────────────────────────────────────────────────
export const adminGetAllLogsService = async (page = 1, limit = 30) => {
  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    InventoryLog.find()
      .populate("product", "name")
      .populate("vendor", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    InventoryLog.countDocuments(),
  ]);

  return { logs, total, page, totalPages: Math.ceil(total / limit) };
};

// // ─── AUTO: Deduct stock on order placed ───────────────────────────────────────
// // Call this from your order service when order is placed
// export const deductStockOnOrder = async (items, session) => {
//   // 1. fetch all products in ONE query
//   const productIds = items.map((i) => i.product);
//   const products = await Product.find({ _id: { $in: productIds } })
//     .select("_id name stock lowStockThreshold vendor")
//     .session(session);

//   const productMap = Object.fromEntries(
//     products.map((p) => [p._id.toString(), p])
//   );

//   // 2. validate all before touching DB
//   for (const item of items) {
//     const product = productMap[item.product.toString()];
//     if (!product) throw new Error(`Product ${item.product} not found`);
//     if (product.stock < item.quantity) {
//       throw new Error(
//         `Insufficient stock for "${product.name}". Available: ${product.stock}`
//       );
//     }
//   }

//   // 3. bulkWrite atomic update — all in one DB call
//   const bulkOps = items.map((item) => {
//     const qty = Number(item.quantity);
//     const product = productMap[item.product.toString()];
//     const stockAfter = product.stock - qty;
//     const stockStatus = computeStockStatus(stockAfter, product.lowStockThreshold);

//     return {
//       updateOne: {
//         filter: { _id: item.product, stock: { $gte: qty } },
//         update: {
//           $inc: { stock: -qty },
//           $set: { stockStatus },
//         },
//       },
//     };
//   });

//   const result = await Product.bulkWrite(bulkOps, { session });

//   if (result.modifiedCount !== items.length) {
//     throw new Error("Stock conflict detected. Please retry your order.");
//   }

//   // 4. bulk insert logs in ONE call
//   const logDocs = items.map((item) => {
//     const qty = Number(item.quantity);
//     const product = productMap[item.product.toString()];
//     return {
//       product: item.product,
//       vendor: product.vendor,
//       change: -qty,
//       reason: "ORDER_PLACED",
//       note: "Order placed",
//       stockBefore: product.stock,
//       stockAfter: product.stock - qty,
//     };
//   });

//   await InventoryLog.insertMany(logDocs, { session });
// };

// // ─── AUTO: Restore stock on order cancelled ────────────────────────────────────
// // Call this from your order service when order is cancelled
// export const restoreStockOnCancel = async (items, session) => {
//   // 1. fetch all in ONE query
//   const productIds = items.map((i) => i.product);
//   const products = await Product.find({ _id: { $in: productIds } })
//     .select("_id stock lowStockThreshold vendor")
//     .session(session);

//   const productMap = Object.fromEntries(
//     products.map((p) => [p._id.toString(), p])
//   );

//   // 2. bulkWrite restore
//   const bulkOps = items
//     .map((item) => {
//       const qty = Number(item.quantity);
//       const product = productMap[item.product.toString()];
//       if (!product) return null;

//       const stockAfter = product.stock + qty;
//       const stockStatus = computeStockStatus(stockAfter, product.lowStockThreshold);

//       return {
//         updateOne: {
//           filter: { _id: item.product },
//           update: {
//             $inc: { stock: +qty },
//             $set: { stockStatus },
//           },
//         },
//       };
//     })
//     .filter(Boolean);

//   await Product.bulkWrite(bulkOps, { session });

//   // 3. bulk insert logs
//   const logDocs = items
//     .map((item) => {
//       const qty = Number(item.quantity);
//       const product = productMap[item.product.toString()];
//       if (!product) return null;
//       return {
//         product: item.product,
//         vendor: product.vendor,
//         change: +qty,
//         reason: "ORDER_CANCELLED",
//         note: "Order cancelled",
//         stockBefore: product.stock,
//         stockAfter: product.stock + qty,
//       };
//     })
//     .filter(Boolean);

//   await InventoryLog.insertMany(logDocs, { session });
// };