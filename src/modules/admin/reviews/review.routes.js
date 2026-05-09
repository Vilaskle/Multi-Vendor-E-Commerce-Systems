import express from "express";
import { authMiddleware, adminOnly } from "../../../middlewares/authMiddleware.js";
import {
  adminGetAllReviews,
  adminGetProductReviews,
  //adminDeleteReview,
  adminReviewSummary,
} from "./review.controller.js";

const router = express.Router();

// summary for admin dashboard
router.get("/summary", authMiddleware, adminOnly, adminReviewSummary);

// all reviews with filter and pagination
router.get("/",  authMiddleware, adminOnly, adminGetAllReviews);

// reviews for one product with rating breakdown
router.get("/product/:productId",   authMiddleware, adminOnly, adminGetProductReviews);

// delete spam or fake review
//router.delete("/:reviewId",   authMiddleware, adminOnly, adminDeleteReview);

export default router;