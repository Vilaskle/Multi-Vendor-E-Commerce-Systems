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

// Toggle active/inactive
export const toggleProductStatusService = async (id) => {
  const product = await Product.findById(id);
  if (!product) return null;

  product.isActive = !product.isActive;
  return await product.save();
};
