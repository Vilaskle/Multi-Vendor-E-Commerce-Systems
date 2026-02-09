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
  updateUserProfile  } from "./user.controller.js";
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
router.post("/user/reset-password", resetPassword);
router.post("/user/resend-otp",otpRateLimiter, resendOtp);
router.get("/user/profile", authMiddleware,isUser, getUserProfile);
router.put("/user/profile", authMiddleware,isUser, updateUserProfile);

export default router;
