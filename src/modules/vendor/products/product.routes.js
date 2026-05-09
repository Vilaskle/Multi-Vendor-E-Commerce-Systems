import express from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  //updateInventory,
  getVendorProducts,
  //restockProduct ,
} from "./product.controller.js";

import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { isVendor } from "../../../middlewares/roleMiddleware.js";
import upload from "../../../middlewares/uploadMiddleware.js";

const router = express.Router();

// Add Product (with images)
router.post(
  "/",
  authMiddleware,
  isVendor,
  upload.array("images", 1),
  addProduct
);

// Edit Full Product
router.put("/:id", authMiddleware, isVendor, updateProduct);

// Delete Product
router.delete("/:id", authMiddleware, isVendor, deleteProduct);

// // Update Price / Stock
// router.patch("/:id/inventory", authMiddleware, isVendor, updateInventory);

// Get Vendor Products
router.get("/", authMiddleware, isVendor, getVendorProducts);

// //restockProduct
// router.patch(
//   "/:id/restock",
//   authMiddleware,
//   isVendor,
//   restockProduct
// );
export default router;