// import express from "express";
// import {
//   getAllOrders,
//   getOrderById,
//   updateOrderStatus,
//   //updatePaymentStatus,
//   //markOrderDelivered,
//   deleteOrder,

//   getAdminOrdersList,
//   getAdminOrderDetail,
//   updateItemStatus,
//   // ── NEW OrderGroup routes ─────────────────────────────────────────────────
//   getAdminOrderGroupsList,
//   getAdminOrderGroupDetail,
//   approveReturn,
//   // settleVendorController,
//   rejectReturn,
//   refundReturn,
//   shipExchange
//   // createOrder,
// } from "./order.controller.js";

// import { authMiddleware,adminOnly } from "../../../middlewares/authMiddleware.js";

// const router = express.Router();

// // Get all orders
// router.get("/", authMiddleware, adminOnly, getAllOrders);

// // Get single order
// router.get("/:id", authMiddleware, adminOnly, getOrderById);

// // Update order status
// router.patch("/:id/status", authMiddleware, adminOnly, updateOrderStatus);

// // Update payment status
// //router.patch("/:id/payment", authMiddleware, adminOnly, updatePaymentStatus);

// // Mark delivered
// //router.patch("/:id/deliver", authMiddleware, adminOnly, markOrderDelivered);

// // Delete order
// router.delete("/:id", authMiddleware, adminOnly, deleteOrder);

// // //create order
// // router.post("/create", authMiddleware, adminOnly, createOrder);
// export default router;


// import express from "express";
// import {
//   getAllOrders,
//   getOrderById,
//   updateOrderStatus,
//   updatePaymentStatus,
//   markOrderDelivered,
//   deleteOrder,
//   getAdminWallet,
// } from "./order.controller.js";

// import { authMiddleware,adminOnly } from "../../../middlewares/authMiddleware.js";

// const router = express.Router();

// // Get all orders
// router.get("/", authMiddleware, adminOnly, getAllOrders);
// router.get("/wallet", authMiddleware, adminOnly, getAdminWallet);

// // Get single order
// router.get("/:id", authMiddleware, adminOnly, getOrderById);

// // Update order status
// router.patch("/:id/status", authMiddleware, adminOnly, updateOrderStatus);

// // Update payment status
// router.patch("/:id/payment", authMiddleware, adminOnly, updatePaymentStatus);

// // Mark delivered
// router.patch("/:id/deliver", authMiddleware, adminOnly, markOrderDelivered);

// // Delete order
// router.delete("/:id", authMiddleware, adminOnly, deleteOrder);

// export default router;


// import express from "express";
// import {
//   getAllOrders,
//   getOrderById,
//   updateOrderStatus,
//   updatePaymentStatus,
//   markOrderDelivered,
//   deleteOrder,
//   getAdminWallet,
//   getAdminOrdersList,    // NEW
//   getAdminOrderDetail,   // NEW
//   updateItemStatus,      // NEW
// } from "./order.controller.js";

// import { authMiddleware, adminOnly } from "../../../middlewares/authMiddleware.js";

// const router = express.Router();

// // ── Existing routes (unchanged) ──────────────────────────────────────────────
// //router.get("/", authMiddleware, adminOnly, getAllOrders);
// router.get("/wallet", authMiddleware, adminOnly, getAdminWallet);
// router.get("/:id", authMiddleware, adminOnly, getOrderById);
// router.patch("/:id/status", authMiddleware, adminOnly, updateOrderStatus);
// router.patch("/:id/payment", authMiddleware, adminOnly, updatePaymentStatus);
// router.patch("/:id/deliver", authMiddleware, adminOnly, markOrderDelivered);
// router.delete("/:id", authMiddleware, adminOnly, deleteOrder);

// // ── NEW routes for AdminOrders.jsx + AdminOrderDetail.jsx ────────────────────

// // GET  /admin/orders/manage          → order blocks list (PENDING / DELIVERED)
// router.get("/manage/list", authMiddleware, adminOnly, getAdminOrdersList);

// // GET  /admin/orders/manage/:id      → full order detail with all items
// router.get("/manage/:id", authMiddleware, adminOnly, getAdminOrderDetail);

// // PATCH /admin/orders/manage/:orderId/item/:itemId/status  → update one item
// router.patch(
//   "/manage/:orderId/item/:itemId/status",
//   authMiddleware,
//   adminOnly,
//   updateItemStatus
// );

// export default router;


// import express from "express";
// import {
//   getAllOrders,
//   getOrderById,
//   updateOrderStatus,
//   updatePaymentStatus,
//   markOrderDelivered,
//   deleteOrder,
//   getAdminWallet,
//   getAdminOrdersList,
//   getAdminOrderDetail,
//   updateItemStatus,
// } from "./order.controller.js";

// import { authMiddleware, adminOnly } from "../../../middlewares/authMiddleware.js";

// const router = express.Router();

// // ── IMPORTANT: Specific routes MUST come before generic /:id routes ──────────

// // Wallet
// router.get("/wallet", authMiddleware, adminOnly, getAdminWallet);

// // NEW: Admin order management routes (must be above /:id to avoid conflict)
// router.get("/manage/list", authMiddleware, adminOnly, getAdminOrdersList);
// router.get("/manage/:id", authMiddleware, adminOnly, getAdminOrderDetail);
// router.patch(
//   "/manage/:orderId/item/:itemId/status",
//   authMiddleware,
//   adminOnly,
//   updateItemStatus
// );

// // ── Generic /:id routes (must come AFTER all specific routes) ────────────────
// router.get("/", authMiddleware, adminOnly, getAllOrders);
// router.get("/:id", authMiddleware, adminOnly, getOrderById);
// router.patch("/:id/status", authMiddleware, adminOnly, updateOrderStatus);
// router.patch("/:id/payment", authMiddleware, adminOnly, updatePaymentStatus);
// router.patch("/:id/deliver", authMiddleware, adminOnly, markOrderDelivered);
// router.delete("/:id", authMiddleware, adminOnly, deleteOrder);

// export default router;

// order.routes.js  — COMPLETE REPLACEMENT
// Three-tier admin flow:
//   Tier 1  GET  /admin/orders/groups/all            → AdminOrders.jsx
//   Tier 2  GET  /admin/orders/groups/:groupId        → AdminOrderGroupDetail.jsx
//   Tier 3  GET  /admin/orders/manage/:orderId        → AdminOrderDetail.jsx
//           PATCH /admin/orders/manage/:orderId/item/:itemId/status

import express from "express";
import {
  // ── existing ──────────────────────────────────────────────────────────────
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  //updatePaymentStatus,
  //markOrderDelivered,
  deleteOrder,
  //getAdminWallet,
  // ── old single-order manage routes (already in your controller) ───────────
  getAdminOrdersList,
  getAdminOrderDetail,
  updateItemStatus,
  // ── NEW OrderGroup routes ─────────────────────────────────────────────────
  getAdminOrderGroupsList,
  getAdminOrderGroupDetail,
} from "./order.controller.js";
import {
  approveReturn,
  // settleVendorController,
  rejectReturn,
  refundReturn,
  shipExchange
} from "./order.controller.js";

import { authMiddleware, adminOnly } from "../../../middlewares/authMiddleware.js";

const router = express.Router();

// ── IMPORTANT: most-specific paths MUST come before wildcard /:id paths ──────

// Wallet
// router.get("/wallet", authMiddleware, adminOnly, getAdminWallet);

// ── TIER 1 & 2 — OrderGroup routes (AdminOrders + AdminOrderGroupDetail) ─────
router.get("/groups/all",       authMiddleware, adminOnly, getAdminOrderGroupsList);
router.get("/groups/:groupId",  authMiddleware, adminOnly, getAdminOrderGroupDetail);

router.patch(
  "/:orderId/items/:itemId/approve-return",
  authMiddleware,
  adminOnly,
  approveReturn
);

router.patch(
  "/:orderId/items/:itemId/reject-return",
  authMiddleware,
  adminOnly,
  rejectReturn
);

router.patch(
  "/:orderId/items/:itemId/refund",
  authMiddleware,
  adminOnly,
  refundReturn
);

router.patch(
  "/:orderId/items/:itemId/exchange-ship",
  authMiddleware,
 adminOnly,
  shipExchange
);
// ── TIER 3 — Single vendor-order detail + item status (AdminOrderDetail) ─────
// GET  /admin/orders/manage/list         (legacy list, keep for backward compat)
router.get("/manage/list",      authMiddleware, adminOnly, getAdminOrdersList);
// GET  /admin/orders/manage/:orderId
router.get("/manage/:id",       authMiddleware, adminOnly, getAdminOrderDetail);
// PATCH /admin/orders/manage/:orderId/item/:itemId/status
router.patch(
  "/manage/:orderId/item/:itemId/status",
  authMiddleware,
  adminOnly,
  updateItemStatus
);


// ── Generic /:id routes — must stay BELOW all named routes ───────────────────
//router.get("/",                 authMiddleware, adminOnly, getAllOrders);
router.get("/:id",              authMiddleware, adminOnly, getOrderById);
router.patch("/:id/status",     authMiddleware, adminOnly, updateOrderStatus);
// router.patch("/:id/payment",    authMiddleware, adminOnly, updatePaymentStatus);
// router.patch("/:id/deliver",    authMiddleware, adminOnly, markOrderDelivered);
router.delete("/:id",           authMiddleware, adminOnly, deleteOrder);

export default router;