import {
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  toggleProductStatusService,
  getPendingProductsService,
  approveProductService,
  rejectProductService,
  //verifyProductService,
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


// GET PENDING PRODUCTS
export const getPendingProducts = async (req, res) => {
  try {
    const products = await getPendingProductsService();

    res.json({ success: true, data: products });
  } catch (err) {
  console.error(err); // 👈 ADD THIS
  res.status(400).json({
    success: false,
    message: err.message // 👈 SHOW REAL ERROR
  });
 }
};

// APPROVE PRODUCT
export const approveProduct = async (req, res) => {
  try {
    const product = await approveProductService(req.params.id);

    res.json({
      success: true,
      message: "Product approved",
      data: product,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// REJECT PRODUCT
export const rejectProduct = async (req, res) => {
  try {
    const { reason } = req.body;

    const product = await rejectProductService(req.params.id, reason);

    res.json({
      success: true,
      message: "Product rejected",
      data: product,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// export const verifyProduct = async (req, res) => {
//   try {
//     const { status, reason } = req.body;

//     // ✅ Validate input
//     if (!status) {
//       return res.status(400).json({
//         success: false,
//         message: "Status is required",
//       });
//     }

//     const product = await verifyProductService(
//       req.params.id,
//       status,
//       reason
//     );

//     res.json({
//       success: true,
//       message: `Product ${status.toLowerCase()} successfully`,
//       data: product,
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };