import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "./notification.controller.js";

import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { isAdmin } from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

// router.get("/", authMiddleware, isAdmin, getNotifications);
// router.get("/unread-count", authMiddleware, isAdmin, getUnreadCount);
// router.patch("/:id/read", authMiddleware, isAdmin, markAsRead);
// router.patch("/read-all", authMiddleware, isAdmin, markAllAsRead);
router.get("/", authMiddleware, isAdmin, getNotifications);
router.get("/unread-count", authMiddleware, isAdmin, getUnreadCount);

router.patch("/read-all", authMiddleware, isAdmin, markAllAsRead);
router.patch("/:id/read", authMiddleware, isAdmin, markAsRead);

export default router;