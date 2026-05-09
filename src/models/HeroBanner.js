import mongoose from "mongoose";

const heroBannerSchema = new mongoose.Schema(
  {
    title:    { type: String, default: "" },
    subtitle: { type: String, default: "" },
    images: [
      {
        url:       { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    displayOrder: { type: Number, default: 0 },
    isActive:     { type: Boolean, default: true },
    createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("HeroBanner", heroBannerSchema);