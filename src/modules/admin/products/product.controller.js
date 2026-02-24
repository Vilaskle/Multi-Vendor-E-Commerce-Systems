import {
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  toggleProductStatusService,
} from "./product.service.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await updateProductService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    await deleteProductService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
    });
  }
};

// Toggle status
export const toggleProductStatus = async (req, res) => {
  try {
    const product = await toggleProductStatusService(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product status updated",
      data: product,
    });
  } catch (error) {
    console.error("TOGGLE ERROR:", error);   // ✅ ADD THIS

    res.status(500).json({
      success: false,
      message: error.message,                // ✅ SHOW REAL MESSAGE
    });
  }
};
