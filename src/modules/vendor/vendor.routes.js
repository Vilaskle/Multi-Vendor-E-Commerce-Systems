// import express from "express";
// import {
//   registerVendor,
//   requestVendorLoginOtp,
//   verifyVendorLoginOtp,
//   getVendorProfile,
//   updateVendorProfile,
//   addProduct
// } from "./vendor.controller.js";

// import { authMiddleware } from "../../middlewares/authMiddleware.js";
// import { isUser, isVendor } from "../../middlewares/roleMiddleware.js";
// import upload from "../../middlewares/uploadMiddleware.js";
// import productRoutes from "./products/product.routes.js";


// import vendorProductRoutes from "./products/product.routes.js";

// router.use("/vendor/products", vendorProductRoutes);
// const router = express.Router();

// /**
//  * ===============================
//  * VENDOR REGISTRATION (USER → VENDOR REQUEST)
//  * ===============================
//  * User submits GST + Shop License for admin approval
//  */
// router.post(
//   "/register",
//   upload.single("shopLicenseFile"),   // must match frontend field name
//   registerVendor
// );

// /**
//  * ===============================
//  * VENDOR LOGIN (ONLY AFTER APPROVAL)
//  * ===============================
//  */
// router.post("/login", requestVendorLoginOtp);
// router.post("/login/verify-otp", verifyVendorLoginOtp);

// /**
//  * ===============================
//  * VENDOR PROFILE
//  * ===============================
//  */
// router.get("/profile", authMiddleware, isVendor, getVendorProfile);
// router.put("/profile", authMiddleware, isVendor, updateVendorProfile);

// /**
//  * ===============================
//  * ADD PRODUCT (ONLY APPROVED VENDOR)
//  * ===============================
//  */
// router.post(
//   "/product",
//   authMiddleware,
//   isVendor,
//   upload.array("images", 5),   // multiple product images
//   addProduct
// );

// export default router;

import express from "express";
import {
  registerVendor,
  requestVendorLoginOtp,
  verifyVendorLoginOtp,
  getVendorProfile,
  updateVendorProfile,
  addBankDetails,
  createFundAccount,
  getVendorWallet,

} from "./vendor.controller.js";

import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { isVendor } from "../../middlewares/roleMiddleware.js";
import upload from "../../middlewares/uploadMiddleware.js";

// ✅ Product routes
import productRoutes from "./products/product.routes.js";
import orderRoutes from "./orders/order.routes.js";
//inventory
import inventoryRoutes from "./inventory/inventory.routes.js";
const router = express.Router();

/**
 * ===============================
 * VENDOR REGISTRATION (NO OTP)
 * ===============================
 */
router.post(
  "/register",
  upload.single("shopLicenseFile"),
  registerVendor
);

/**
 * ===============================
 * VENDOR LOGIN (OTP BASED)
 * ===============================
 */
router.post("/login", requestVendorLoginOtp);
router.post("/login/verify-otp", verifyVendorLoginOtp);

/**
 * ===============================
 * VENDOR PROFILE
 * ===============================
 */
router.get("/profile", authMiddleware, isVendor, getVendorProfile);
router.put("/profile", authMiddleware, isVendor, updateVendorProfile);

/**
 * ===============================
 * PRODUCT MODULE
 * ===============================
 */
router.use("/products", authMiddleware, isVendor, productRoutes);

router.use("/inventory", authMiddleware, isVendor, inventoryRoutes); // ← ADD THIS


router.use("/orders",authMiddleware, isVendor, orderRoutes)



//new
router.post("/bank-details",authMiddleware,isVendor,addBankDetails);
router.post("/setup-payout",authMiddleware,isVendor,createFundAccount);
 //router.post("/setup-payout", authMiddleware, isVendor, setupPayout);
 router.get("/wallet", authMiddleware, isVendor, getVendorWallet);

export default router;