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
  addProduct
} from "./vendor.controller.js";

import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { isVendor } from "../../middlewares/roleMiddleware.js";
import upload from "../../middlewares/uploadMiddleware.js";

//  ✅ Import product routes ONCE
 import productRoutes from "./products/product.routes.js";

const router = express.Router();

/**
 * ===============================
 * VENDOR REGISTRATION
 * ===============================
 */
router.post(
  "/register",
  upload.single("shopLicenseFile"),
  registerVendor
);

/**
 * ===============================
 * VENDOR LOGIN
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
 * PRODUCT MODULE (IMPORTANT)
 * ===============================
 * This mounts ALL product APIs under:
 * /api/vendor/products/*
 */
router.use("/products", authMiddleware, isVendor, productRoutes);


export default router;