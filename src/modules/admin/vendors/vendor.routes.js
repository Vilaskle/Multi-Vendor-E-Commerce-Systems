import express from "express";
import {
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  toggleVendorStatus,
  approveVendor,
  
} from "./vendor.controller.js";

import { authMiddleware, adminOnly } from "../../../middlewares/authMiddleware.js";
const router = express.Router();

// Get all vendors
router.get("/", authMiddleware, adminOnly,getAllVendors);

// Get vendor by ID
router.get("/:id", authMiddleware, adminOnly,getVendorById);

// Update vendor
router.put("/:id", authMiddleware, adminOnly,updateVendor);

// Delete vendor
router.delete("/:id", authMiddleware, adminOnly,deleteVendor);

// // Block / Unblock vendor
 router.patch("/:id/block",authMiddleware, adminOnly, toggleVendorStatus);

// Approve / Reject
router.patch("/:id/status", authMiddleware, adminOnly,approveVendor);

// router.patch("/vendors/:id/status", authMiddleware, isAdmin, updateVendorStatus);

export default router;
