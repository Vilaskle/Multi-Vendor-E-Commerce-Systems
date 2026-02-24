import express from "express";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  markOrderDelivered,
  deleteOrder,
} from "./order.controller.js";

import { authMiddleware,adminOnly } from "../../../middlewares/authMiddleware.js";

const router = express.Router();

// Get all orders
router.get("/", authMiddleware, adminOnly, getAllOrders);

// Get single order
router.get("/:id", authMiddleware, adminOnly, getOrderById);

// Update order status
router.patch("/:id/status", authMiddleware, adminOnly, updateOrderStatus);

// Update payment status
router.patch("/:id/payment", authMiddleware, adminOnly, updatePaymentStatus);

// Mark delivered
router.patch("/:id/deliver", authMiddleware, adminOnly, markOrderDelivered);

// Delete order
router.delete("/:id", authMiddleware, adminOnly, deleteOrder);

export default router;
