import Product from "../../../models/Product.js";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload.js";
// import { calculateStockStatus } from "../../../utils/stockValidation.js";
// ADD PRODUCT
export const addProductService = async (data, files, vendorId) => {
  if (!files.length) throw new Error("Images required");

  const images = [];

  for (const file of files) {
    const uploaded = await uploadToCloudinary(
      file.buffer,
      `vendors/${vendorId}/products`
    );

    images.push({
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    });
  }

  const product = await Product.create({
    ...data,
    vendor: vendorId,
    images,
    status: "PENDING", // 🔥 IMPORTANT
  });

  return product;
};

// UPDATE PRODUCT (vendor-owned only)
export const updateProductService = async (id, data, vendorId) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, vendor: vendorId },
    data,
    { new: true }
  );

  if (!product) {
    throw new Error("Product not found or unauthorized");
  }

  return product;
};

// DELETE PRODUCT
export const deleteProductService = async (id, vendorId) => {
  const product = await Product.findOneAndDelete({
    _id: id,
    vendor: vendorId,
  });

  if (!product) {
    throw new Error("Product not found or unauthorized");
  }
};



//   if (!product) {
//     throw new Error("Product not found or unauthorized");
//   }

//   return product;
// };


// /* ================= RESTOCK PRODUCT ================= */
// export const restockProductService = async (id, vendorId, quantity) => {

//   if (quantity <= 0) {
//     throw new Error("Quantity must be greater than 0");
//   }

//   const product = await Product.findOne({ _id: id, vendor: vendorId });

//   if (!product) throw new Error("Product not found");

//   product.stock += quantity;

//   if (product.stock === 0) product.stockStatus = "OUT_OF_STOCK";
//   else if (product.stock <= 5) product.stockStatus = "LOW_STOCK";
//   else product.stockStatus = "IN_STOCK";

//   product.inventoryLogs.push({
//     change: quantity,
//     reason: "Restock",
//   });

//   await product.save();

//   return product;
// };


// GET ALL PRODUCTS OF VENDOR
export const getVendorProductsService = async (vendorId) => {
  return await Product.find({ vendor: vendorId }).sort({ createdAt: -1 });
};