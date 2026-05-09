import mongoose from "mongoose";

const promotionBannerSchema = new mongoose.Schema(
  {
    title:    { type: String, default: "" },
    subtitle: { type: String, default: "" },

    // layout hint for the frontend component
    type: {
      type: String,
      enum: ["FULL_WIDTH", "SPLIT", "STRIP"],
      default: "FULL_WIDTH",
    },

    image: {
      url:       { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    link:      { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate:   { type: Date, required: true },

    displayOrder: { type: Number, default: 0 },
    isActive:     { type: Boolean, default: true },
    createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

promotionBannerSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model("PromotionBanner", promotionBannerSchema);