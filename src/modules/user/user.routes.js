import express from "express";
import {registerUser,
    requestUserLoginOtp,
  verifyUserLoginOtp,getUserProfile,updateUserProfile  } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { isUser } from "../../middlewares/roleMiddleware.js";

const router = express.Router();


// User Registration
router.post("/user/register", registerUser);
router.post("/user/login", requestUserLoginOtp);
router.post("/user/login/verify-otp", verifyUserLoginOtp);


router.get("/user/profile", authMiddleware,isUser, getUserProfile);
router.put("/user/profile", authMiddleware,isUser, updateUserProfile);

export default router;
