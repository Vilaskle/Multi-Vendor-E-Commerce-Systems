// const express = require("express");
// const router = express.Router();
// const userController = require("./user.controller");

// // Get all users
// router.get("/", userController.getAllUsers);

// // Get single user
// router.get("/:id", userController.getUserById);

// // Create user
// router.post("/", userController.createUser);

// // Update user
// router.put("/:id", userController.updateUser);

// // Delete user
// router.delete("/:id", userController.deleteUser);

// // Block / Unblock user
// router.patch("/:id/block", userController.toggleBlockUser);

// // Change role
// router.patch("/:id/role", userController.changeUserRole);

// // Verify email
// router.patch("/:id/verify-email", userController.verifyEmail);

// module.exports = router;


import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  changeUserRole,
  verifyUserEmail,
} from "./user.controller.js";
import { authMiddleware, adminOnly } from "../../../middlewares/authMiddleware.js";
const router = express.Router();

// Get all users
router.get("/",  authMiddleware, adminOnly,getAllUsers);

// Get single user
router.get("/:id",  authMiddleware, adminOnly,getUserById);

// Update user
router.put("/:id", authMiddleware, adminOnly, updateUser);

// Delete user
router.delete("/:id",  authMiddleware, adminOnly,deleteUser);

// Block / Unblock user
router.patch("/:id/block",  authMiddleware, adminOnly,toggleUserStatus);

// Change role
router.patch("/:id/role",  authMiddleware, adminOnly,changeUserRole);

// Verify email
router.patch("/:id/verify-email",  authMiddleware, adminOnly,verifyUserEmail);

export default router;
