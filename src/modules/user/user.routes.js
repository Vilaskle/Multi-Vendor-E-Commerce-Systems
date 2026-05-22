import express from "express";
import {registerUser,
      verifyEmailOtp ,
      loginWithPassword ,
    requestUserLoginOtp,
  verifyUserLoginOtp,
  forgotPassword ,
  resetPassword ,
  resendOtp ,
  getUserProfile,
  updateUserProfile,
addAddress,
 getAddresses,
updateAddress ,
deleteAddress,
getProducts,
getSingleProduct,
 addToCart,
 getCart,
  updateCartItem,
    removeCartItem,
 clearCart,
addToWishlist,
getWishlist,
 removeFromWishlist,
createPayment, verifyPayment,
getMyOrders,
cancelOrderItem,
requestReturn,
requestExchange,
getCheckoutSummary,
saveRefundDetails,
addReview,
getProductReviews,
getHomePage,
getOrderPolicyController,
refreshAccessToken,
  logoutUser,
getRecentOrders,
getProductFilters,validateStock} from "./user.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { isUser } from "../../middlewares/roleMiddleware.js";
import {
  otpRateLimiter,
  loginRateLimiter,
} from "../../middlewares/rateLimitMiddleware.js";

const router = express.Router();


// User Registration
router.post("/user/register", registerUser);
router.post("/user/verify-email", verifyEmailOtp);
router.post("/user/login/password",loginRateLimiter, loginWithPassword);
router.post("/user/login",loginRateLimiter, requestUserLoginOtp);
router.post("/user/login/verify-otp", verifyUserLoginOtp);
router.post("/user/forgot-password",otpRateLimiter, forgotPassword);
router.post("/user/reset-password/:token", resetPassword);
router.post("/user/resend-otp",otpRateLimiter, resendOtp);
router.get("/user/profile", authMiddleware,isUser, getUserProfile);
router.put("/user/profile", authMiddleware,isUser, updateUserProfile);
router.post("/user/address", authMiddleware, addAddress);
router.get("/user/address", authMiddleware, getAddresses);
router.put("/user/address/:addressId", authMiddleware, updateAddress);
router.delete("/user/address/:addressId", authMiddleware, deleteAddress);
router.get("/user/products", getProducts);
router.get("/user/products/:id", getSingleProduct);



router.post("/user/cart", authMiddleware, isUser, addToCart);
router.get("/user/cart", authMiddleware, isUser, getCart);
router.put(
  "/user/cart/item/:cartItemId",
  authMiddleware,
  isUser,
  updateCartItem
);
router.delete(
  "/user/cart/item/:cartItemId",
  authMiddleware,
  isUser,
  removeCartItem
);
router.delete("/user/cart", authMiddleware, isUser, clearCart);

// WISHLIST ROUTES
router.post("/user/wishlist", authMiddleware, isUser, addToWishlist);
router.get("/user/wishlist", authMiddleware, isUser, getWishlist);
router.delete("/user/wishlist/:productId", authMiddleware, isUser, removeFromWishlist);


router.post(
  "/user/checkout/summary",
  authMiddleware,
  isUser,
  getCheckoutSummary
);

// CHECKOUT & PAYMENT
router.post(
  "/user/checkout/create-payment",
  authMiddleware,
  isUser,
  createPayment
);

router.post(
  "/user/checkout/verify-payment",
  authMiddleware,
  isUser,
  verifyPayment
);

router.get("/user/orders",authMiddleware,isUser, getMyOrders);

// ================= ORDER ITEM ACTIONS =================
router.patch(
  "/user/orders/:orderId/items/:itemId/cancel",
  authMiddleware,
  isUser,
  cancelOrderItem
);

router.patch(
  "/user/orders/:orderId/items/:itemId/return",
  authMiddleware,
  isUser,
  requestReturn
);


router.patch(
  "/user/orders/:orderId/items/:itemId/exchange",
  authMiddleware,
  isUser,
  requestExchange
);


router.patch(
  "/user/orders/:orderId/items/:itemId/refund-details",
  authMiddleware,
  isUser,
  saveRefundDetails
);

router.post(
  "/user/reviews",
  authMiddleware,
  isUser,
  addReview
);

router.get("/reviews/:productId", getProductReviews);

// router.get("/homepage", getHomePage);

router.get("/user/order-policy",getOrderPolicyController);

router.post(
  "/user/refresh-token",
  refreshAccessToken
);

router.post(
  "/user/logout",
  logoutUser
);

router.get("/user/recent-orders", authMiddleware,isUser, getRecentOrders);
router.get("/user/products/filters", getProductFilters);

router.post(
  "/user/validate-stock",
  authMiddleware,
  isUser,
  validateStock
);
export default router;
