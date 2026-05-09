import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    orderItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

/* ✅ Prevent duplicate review */
reviewSchema.index(
  { user: 1, orderItemId: 1 },
  { unique: true }
);

export default mongoose.model("Review", reviewSchema);