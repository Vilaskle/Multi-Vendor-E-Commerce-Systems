import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "NEW_VENDOR",
        "NEW_ORDER",
        "NEW_PRODUCT",
        "LOW_STOCK",
        "ORDER_CANCELLED",
        "PRODUCT_FLAGGED",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);