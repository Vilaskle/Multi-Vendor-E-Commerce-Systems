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

// import express from "express";
// import {
//   getAllVendors,
//   approveVendor,
//   rejectVendor,
// } from "./admin.controller.js";

// import { authMiddleware } from "../../middlewares/authMiddleware.js";
// import { isAdmin } from "../../middlewares/roleMiddleware.js";
// import { adminLogin } from "./admin.controller.js";
// //import { getAllUsersByAdminController } from "./admin.controller.js";
// import productRoutes from "./products/product.routes.js";
// import orderRoutes from "./orders/order.routes.js";
// import vendorRoutes from "./vendors/vendor.routes.js";
// import userRoutes from "./users/user.routes.js";

// const router = express.Router();

// router.use("/products", productRoutes);
// router.post("/login", adminLogin);
// // View all vendors
// //router.get("/vendors", authMiddleware, isAdmin, getAllVendors);

// // // Approve vendor
// // router.put("/vendor/:vendorId/approve", authMiddleware, isAdmin, approveVendor);

// // // Reject vendor
// // router.put("/vendor/:vendorId/reject", authMiddleware, isAdmin, rejectVendor);
// router.use("/orders", orderRoutes);


// router.use("/users", userRoutes);
// router.use("/vendors", vendorRoutes);

// router.use("/products", productRoutes)

// export default router;


// import express from "express";
// import { authMiddleware } from "../../middlewares/authMiddleware.js";
// import { isAdmin } from "../../middlewares/roleMiddleware.js";
// import { getDashboardData } from "./admin.controller.js";
// import { adminLogin, getDashboardCounts } from "./admin.controller.js";

// import productRoutes from "./products/product.routes.js";
// import orderRoutes from "./orders/order.routes.js";
// import vendorRoutes from "./vendors/vendor.routes.js";
// import userRoutes from "./users/user.routes.js";

// const router = express.Router();

// // Admin Login
// router.post("/login", adminLogin);

// //analytics
// router.get("/analysis", authMiddleware, isAdmin, getDashboardData);

// // Dashboard counts (for sidebar badges)
// router.get("/dashboard/counts", authMiddleware, isAdmin, getDashboardCounts);


// // Modules
// router.use("/products", productRoutes);
// router.use("/orders", orderRoutes);
// router.use("/users", userRoutes);
// router.use("/vendors", vendorRoutes);


// export default router;


// import express from "express";
// import { authMiddleware } from "../../middlewares/authMiddleware.js";
// import { isAdmin } from "../../middlewares/roleMiddleware.js";
// import {
//   adminLogin,
//   getDashboardCounts,
//   getDashboardData,
//   adminLogin,
//   getDashboardCounts,
//   getDashboardData,
//   getGraphData,  
// } from "./admin.controller.js";

// import productRoutes from "./products/product.routes.js";
// import orderRoutes from "./orders/order.routes.js";
// import vendorRoutes from "./vendors/vendor.routes.js";
// import userRoutes from "./users/user.routes.js";

// const router = express.Router();

// // Public
// router.post("/login", adminLogin);

// // Protected
// router.get("/analysis", authMiddleware, isAdmin, getDashboardData);
// router.get("/dashboard/counts", authMiddleware, isAdmin, getDashboardCounts);
// //
// router.get("/graphs", authMiddleware, isAdmin, getGraphData);

// // Sub-modules (protected)
// router.use("/products", authMiddleware, isAdmin, productRoutes);
// router.use("/orders", authMiddleware, isAdmin, orderRoutes);
// router.use("/users", authMiddleware, isAdmin, userRoutes);
// router.use("/vendors", authMiddleware, isAdmin, vendorRoutes);

// export default router;

import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { isAdmin } from "../../middlewares/roleMiddleware.js";
import {
  adminLogin,
  getDashboardCounts,
  getDashboardData,
  getGraphData,
  getAdminWallet,
} from "./admin.controller.js";

import {
  approveReturn,
  settleVendorController,
  rejectReturn,
  refundReturn,
  shipExchange,
   getOrderPolicyController,
  updateOrderPolicyController,
} from "./admin.controller.js";


import productRoutes from "./products/product.routes.js";
import orderRoutes from "./orders/order.routes.js";
import vendorRoutes from "./vendors/vendor.routes.js";
import userRoutes from "./users/user.routes.js";
import homepageRoutes from "./homepage/homepage.routes.js";
import reviewRoutes from "./reviews/review.routes.js";
import notificationRoutes from "./notifications/notification.routes.js";

const router = express.Router();

// // Public
 router.post("/login", adminLogin);

// Protected
router.get("/analysis", authMiddleware, isAdmin, getDashboardData);
router.get("/dashboard/counts", authMiddleware, isAdmin, getDashboardCounts);
router.get("/graphs", authMiddleware, isAdmin, getGraphData);

// Sub-modules (protected)
router.use("/products", authMiddleware, isAdmin, productRoutes);
router.use("/orders", authMiddleware, isAdmin, orderRoutes);
router.use("/users", authMiddleware, isAdmin, userRoutes);
router.use("/vendors", authMiddleware, isAdmin, vendorRoutes);4

//special offer 
router.use("/homepage", authMiddleware, isAdmin,homepageRoutes);
//review
router.use("/reviews", reviewRoutes);
router.use("/notifications",notificationRoutes);
router.get("/wallet", authMiddleware, isAdmin,getAdminWallet);


router.patch(
  "/orders/:orderId/items/:itemId/approve-return",
  authMiddleware,
  isAdmin,
  approveReturn
);

router.patch(
  "/orders/:orderId/items/:itemId/reject-return",
  authMiddleware,
  isAdmin,
  rejectReturn
);

router.patch(
  "/orders/:orderId/items/:itemId/refund",
  authMiddleware,
  isAdmin,
  refundReturn
);

router.patch(
  "/orders/:orderId/items/:itemId/exchange-ship",
  authMiddleware,
  isAdmin,
  shipExchange
);
router.post(
  "/settle/vendor/:vendorId",
  authMiddleware,
  isAdmin,
  settleVendorController
);

router.get(
  "/order-policy",
  isAdmin,
  getOrderPolicyController
);

router.put(
  "/order-policy",
  isAdmin,
  updateOrderPolicyController
);
export default router;