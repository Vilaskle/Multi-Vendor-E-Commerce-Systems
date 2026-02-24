import express from "express";
import {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from "./product.controller.js";

import { authMiddleware, adminOnly } from "../../../middlewares/authMiddleware.js";

const router = express.Router();

/*
  PRODUCT ROUTES (Admin Only)
*/

router.get("/", authMiddleware, adminOnly, getAllProducts);

router.get("/:id", authMiddleware, adminOnly, getProductById);

router.put("/:id", authMiddleware, adminOnly, updateProduct);

router.delete("/:id", authMiddleware, adminOnly, deleteProduct);

router.patch(
  "/:id/status",
  authMiddleware,
  adminOnly,
  toggleProductStatus
);

export default router;
