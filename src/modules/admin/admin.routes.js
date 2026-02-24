// import express from "express";
// import {
//   getAllVendors,
//   approveVendor,
//   rejectVendor,
//   getPendingVendors,
// } from "./admin.controller.js";

// import { authMiddleware } from "../../middlewares/authMiddleware.js";
// import { isAdmin } from "../../middlewares/roleMiddleware.js";
// import { adminLogin } from "./admin.controller.js";

// const router = express.Router();

// router.post("/admin/login", adminLogin);
// //pendong venodre
// router.get("/admin/vendors/pending", authMiddleware, isAdmin, getPendingVendors);

// // View all vendors
// router.get("/admin/vendors", authMiddleware, isAdmin, getAllVendors);

// // Approve vendor
// router.put("/admin/vendor/:vendorId/approve", authMiddleware, isAdmin, approveVendor);

// // Reject vendor
// router.put("/admin/vendor/:vendorId/reject", authMiddleware, isAdmin, rejectVendor);


// export default router;

import express from "express";
// import {
//   getAllVendors,
//   approveVendor,
//   rejectVendor,
// } from "./admin.controller.js";

import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { isAdmin } from "../../middlewares/roleMiddleware.js";
import { adminLogin } from "./admin.controller.js";
//import { getAllUsersByAdminController } from "./admin.controller.js";
import productRoutes from "./products/product.routes.js";
import orderRoutes from "./orders/order.routes.js";
import vendorRoutes from "./vendors/vendor.routes.js";
import userRoutes from "./users/user.routes.js";

const router = express.Router();

router.use("/products", productRoutes);
router.post("/login", adminLogin);
// View all vendors
//router.get("/vendors", authMiddleware, isAdmin, getAllVendors);

// // Approve vendor
// router.put("/vendor/:vendorId/approve", authMiddleware, isAdmin, approveVendor);

// // Reject vendor
// router.put("/vendor/:vendorId/reject", authMiddleware, isAdmin, rejectVendor);
router.use("/orders", orderRoutes);


router.use("/users", userRoutes);
router.use("/vendors", vendorRoutes);

router.get("/products", productRoutes)

export default router;