import Order from "../../../models/Order.js";
//import Product from "../../../models/Product.js";

/* Get orders that contain vendor products */
export const getVendorOrdersService = async (vendorId) => {
  const orders = await Order.find({ "items.vendor": vendorId })
    .populate("user", "name email")
    .populate("items.product", "name images price");

  return orders;
};


// /* Reduce stock when an order is created */
// export const reduceStockAfterOrder = async (productId, quantity) => {
//   const product = await Product.findById(productId);

//   if (!product) {
//     throw new Error("Product not found");
//   }

//   if (product.stock < quantity) {
//     throw new Error("Insufficient stock");
//   }

//   product.stock -= quantity;

//   // update stock status
//   if (product.stock === 0) product.stockStatus = "OUT_OF_STOCK";
//   else if (product.stock <= 5) product.stockStatus = "LOW_STOCK";
//   else product.stockStatus = "IN_STOCK";

//   product.inventoryLogs.push({
//     change: -quantity,
//     reason: "Order placed",
//   });

//   await product.save();

//   return product;
// };
