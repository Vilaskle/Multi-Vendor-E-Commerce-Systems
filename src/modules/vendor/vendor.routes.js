import express from "express";
import { registerVendor } from "./vendor.controller.js";
import {
  requestVendorLoginOtp,
  verifyVendorLoginOtp,
  getVendorProfile,
  updateVendorProfile,
} from "./vendor.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { isVendor } from "../../middlewares/roleMiddleware.js";
import upload from "../../middlewares/uploadMiddleware.js";
import { addProduct } from "./vendor.controller.js";

const router = express.Router();

// Vendor Registration
router.post("/vendor/register", registerVendor);
router.post("/vendor/login", requestVendorLoginOtp);
router.post("/vendor/login/verify-otp", verifyVendorLoginOtp);

router.get("/vendor/profile", authMiddleware, isVendor, getVendorProfile);
router.put("/vendor/profile", authMiddleware, isVendor, updateVendorProfile);

router.post(
  "/vendor/products",
  authMiddleware,
  isVendor,
  upload.array("images", 5),
  addProduct
);
export default router;
