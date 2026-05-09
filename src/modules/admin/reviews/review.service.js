import Review from "../../../models/Review.js";
import Product from "../../../models/Product.js";

// ─── Get all reviews (admin sees everything) ──────────────────────────────────
export const adminGetAllReviewsService = async ({
  page = 1,
  limit = 20,
  rating,
  search,
}) => {
  const filter = {};

  // filter by rating if provided
  if (rating) filter.rating = Number(rating);

  // search by comment keyword
  if (search) {
    filter.comment = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("user", "name email")
      .populate("product", "name images category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments(filter),
  ]);

  return {
    reviews,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

// ─── Get reviews for one product with full stats ───────────────────────────────
export const adminGetProductReviewsService = async (productId) => {
  const product = await Product.findById(productId).select(
    "name images rating numReviews category"
  );

  if (!product) throw new Error("Product not found");

  // get all reviews for this product
  const reviews = await Review.find({ product: productId })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  // rating breakdown — how many 1 star, 2 star etc
  const breakdown = await Review.aggregate([
    {
      $match: {
        product: product._id,
      },
    },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  // format breakdown as { 5: 10, 4: 5, 3: 2, 2: 1, 1: 0 }
  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  breakdown.forEach((b) => {
    ratingBreakdown[b._id] = b.count;
  });

  return {
    product: {
      id: product._id,
      name: product.name,
      category: product.category,
      images: product.images,
      averageRating: product.rating,
      totalReviews: product.numReviews,
    },
    ratingBreakdown,
    reviews,
  };
};

// // ─── Delete a review (spam / fake) ────────────────────────────────────────────
// export const adminDeleteReviewService = async (reviewId) => {
//   const review = await Review.findById(reviewId);
//   if (!review) throw new Error("Review not found");

//   const productId = review.product;

//   await Review.findByIdAndDelete(reviewId);

//   // recalculate product rating after deletion
//   const stats = await Review.aggregate([
//     { $match: { product: productId } },
//     {
//       $group: {
//         _id: "$product",
//         avgRating: { $avg: "$rating" },
//         total: { $sum: 1 },
//       },
//     },
//   ]);

//   // if no reviews left set to 0
//   await Product.findByIdAndUpdate(productId, {
//     rating: stats[0]?.avgRating ?? 0,
//     numReviews: stats[0]?.total ?? 0,
//   });

//   return { deleted: true, reviewId };
// };

// ─── Get overall rating summary for admin dashboard ───────────────────────────
export const adminReviewSummaryService = async () => {
  const [totalReviews, ratingDistribution, topRatedProducts, lowRatedProducts] =
    await Promise.all([
      // total reviews count
      Review.countDocuments(),

      // overall rating distribution
      Review.aggregate([
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
      ]),

      // top 5 highest rated products
      Product.find({ numReviews: { $gt: 0 } })
        .select("name rating numReviews images category")
        .sort({ rating: -1 })
        //.sort({ rating: -1, numReviews: -1 })
        .limit(5),

      // top 5 lowest rated products (need attention)
      Product.find({ numReviews: { $gt: 0 } })
        .select("name rating numReviews images category")
        .sort({ rating: 1 })
        //.sort({ rating: 1, numReviews: -1 })
        .limit(5),
    ]);

  // format distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ratingDistribution.forEach((r) => {
    distribution[r._id] = r.count;
  });

  // overall average
  const avgResult = await Review.aggregate([
    {
      $group: {
        _id: null,
        avg: { $avg: "$rating" },
      },
    },
  ]);

  return {
    totalReviews,
    overallAverage: avgResult[0]?.avg
      ? Math.round(avgResult[0].avg * 10) / 10
      : 0,
    ratingDistribution: distribution,
    topRatedProducts,
    lowRatedProducts,
  };
};