import {
  adminGetAllReviewsService,
  adminGetProductReviewsService,
  //adminDeleteReviewService,
  adminReviewSummaryService,
} from "./review.service.js";

// ─── Get all reviews ──────────────────────────────────────────────────────────
export const adminGetAllReviews = async (req, res) => {
  try {
    const { page, limit, rating, search } = req.query;

    const result = await adminGetAllReviewsService({
      page,
      limit,
      rating,
      search,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Get reviews for one product ──────────────────────────────────────────────
export const adminGetProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await adminGetProductReviewsService(productId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// // ─── Delete a review ──────────────────────────────────────────────────────────
// export const adminDeleteReview = async (req, res) => {
//   try {
//     const { reviewId } = req.params;

//     const result = await adminDeleteReviewService(reviewId);

//     return res.status(200).json({
//       success: true,
//       message: "Review deleted and product rating recalculated",
//       data: result,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// ─── Get review summary for dashboard ─────────────────────────────────────────
export const adminReviewSummary = async (req, res) => {
  try {
    const result = await adminReviewSummaryService();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};