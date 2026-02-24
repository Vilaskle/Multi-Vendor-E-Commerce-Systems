import Product from "../../../models/Product.js";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload.js";

// ADD PRODUCT
export const addProductService = async (data, files, vendorId) => {
  if (!files || !files.length) {
    throw new Error("Product images are required");
  }

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

  return await Product.create({
    ...data,
    vendor: vendorId,
    images,
  });
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

// UPDATE PRICE / STOCK
export const updateInventoryService = async (id, data, vendorId) => {
  const allowed = {};

  if (data.price !== undefined) allowed.price = data.price;
  if (data.quantity !== undefined) allowed.quantity = data.quantity;

  const product = await Product.findOneAndUpdate(
    { _id: id, vendor: vendorId },
    allowed,
    { new: true }
  );

  if (!product) {
    throw new Error("Product not found or unauthorized");
  }

  return product;
};

// GET ALL PRODUCTS OF VENDOR
export const getVendorProductsService = async (vendorId) => {
  return await Product.find({ vendor: vendorId }).sort({ createdAt: -1 });
};