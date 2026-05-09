import mongoose from "mongoose";

const offerBannerSchema = new mongoose.Schema(
  {
    title:    { type: String, default: "" },
    subtitle: { type: String, default: "" },

    // "FESTIVAL" | "SALE" | "DISCOUNT"
    type: {
      type: String,
      enum: ["FESTIVAL", "SALE", "DISCOUNT"],
      required: true,
    },

    image: {
      url:       { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    link: { type: String, default: "" },

    // show this banner only within this date window
    startDate: { type: Date, required: true },
    endDate:   { type: Date, required: true },

    displayOrder: { type: Number, default: 0 },
    isActive:     { type: Boolean, default: true },
    createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

offerBannerSchema.index({ type: 1, startDate: 1, endDate: 1 });

export default mongoose.model("OfferBanner", offerBannerSchema);