import Product from "../../../models/Product.js";

// Get all products
export const getAllProductsService = async () => {
  return await Product.find()
    .populate("vendor", "name email")
    .sort({ createdAt: -1 });
};

// Get single product
export const getProductByIdService = async (id) => {
  return await Product.findById(id).populate("vendor", "name email");
};

// Update product
export const updateProductService = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
  });
};

// Delete product
export const deleteProductService = async (id) => {
  return await Product.findByIdAndDelete(id);
};

// admin/products/product.service.js
export const toggleProductStatusService = async (id) => {
  const product = await Product.findById(id);
  if (!product) return null;

  // toggle between approved and rejected
  product.isActive = product.isActive ;

  return await product.save();
};


//import Product from "../../../mdels/Product.js";

// GET ALL PENDING PRODUCTS
export const getPendingProductsService = async () => {
  return await Product.find({ status: "pending" }).populate("vendor");
};

// APPROVE PRODUCT
export const approveProductService = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { status: "approved", rejectionReason: "" },
    { new: true }
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

// REJECT PRODUCT
export const rejectProductService = async (productId, reason) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { status: "rejected", rejectionReason: reason },
    { new: true }
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};


// export const verifyProductService = async (id, status, reason = "") => {
//   // ✅ Validate status
//   if (!["APPROVED", "REJECTED"].includes(status)) {
//     throw new Error("Invalid status");
//   }

//   const product = await Product.findById(id);
//   if (!product) throw new Error("Product not found");

//   // ✅ Prevent duplicate updates
//   if (product.status === status) {
//     return product;
//   }

//   // ✅ Update status
//   product.status = status;

//   // ❌ REJECT CASE
//   if (status === "REJECTED") {
//     product.rejectionReason =
//       reason && reason.trim()
//         ? reason.trim()
//         : "Invalid product";
//   }

//   // ✅ APPROVE CASE
//   if (status === "APPROVED") {
//     product.rejectionReason = null;
//   }

//   await product.save();

//   // 🔔 OPTIONAL Notification
//   /*
//   await createNotification({
//     type: status === "APPROVED" ? "PRODUCT_APPROVED" : "PRODUCT_REJECTED",
//     message: `Product "${product.name}" ${status.toLowerCase()}`,
//     relatedId: product._id,
//   });
//   */

//   return product;
// };