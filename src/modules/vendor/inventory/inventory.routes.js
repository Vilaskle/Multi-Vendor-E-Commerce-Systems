import express from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { isVendor, isAdmin } from "../../../middlewares/roleMiddleware.js";
import {
  getVendorInventory,
  getLowStockAlerts,
  getVendorLogs,
  getProductLogs,
  addStock,
  reduceStock,
  updateStock,
  updateThreshold,
  adminLowStock,
  adminAllLogs,
} from "./inventory.controller.js";

const router = express.Router();

// ── Vendor routes ────────────────────────────────────────────────────────────
// NOTE: authMiddleware + isVendor already applied in vendor.routes.js
// so we don't repeat them here

router.get("/",                        getVendorInventory);
router.get("/low-stock",               getLowStockAlerts);
router.get("/logs",                    getVendorLogs);
router.get("/:productId/logs",         getProductLogs);
router.post("/:productId/add",         addStock);
router.post("/:productId/reduce",      reduceStock);
router.put("/:productId/update",       updateStock);
router.put("/:productId/threshold",    updateThreshold);

// ── Admin routes (re-add auth here since vendor.routes doesn't cover admin) ──
router.get("/admin/low-stock", authMiddleware, isAdmin, adminLowStock);
router.get("/admin/logs",      authMiddleware, isAdmin, adminAllLogs);

export default router;