import express from "express";
import {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  //verifyProduct ,
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
  "/status/:id",
  authMiddleware,
  adminOnly,
  toggleProductStatus
);
//router.patch("/:id/verify", authMiddleware, adminOnly, verifyProduct);

router.get("/pending", authMiddleware, adminOnly, getPendingProducts);

 router.patch("/approve/:id", authMiddleware, adminOnly, approveProduct);

 router.patch("/reject/:id", authMiddleware, adminOnly, rejectProduct);

export default router;
