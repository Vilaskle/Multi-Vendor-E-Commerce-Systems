import express from "express";
import {
  getAllVendors,
  approveVendor,
  rejectVendor,
} from "./admin.controller.js";

import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { isAdmin } from "../../middlewares/roleMiddleware.js";
import { adminLogin } from "./admin.controller.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
// View all vendors
router.get("/admin/vendors", authMiddleware, isAdmin, getAllVendors);

// Approve vendor
router.put("/admin/vendor/:vendorId/approve", authMiddleware, isAdmin, approveVendor);

// Reject vendor
router.put("/admin/vendor/:vendorId/reject", authMiddleware, isAdmin, rejectVendor);

export default router;

