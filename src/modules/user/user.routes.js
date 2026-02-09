import express from "express";
import { getUserProfile,updateUserProfile  } from "./user.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { isUser } from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/user/profile", authMiddleware,isUser, getUserProfile);
router.put("/user/profile", authMiddleware,isUser, updateUserProfile);

export default router;
