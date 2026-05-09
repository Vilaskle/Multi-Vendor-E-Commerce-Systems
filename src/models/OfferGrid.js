import mongoose from "mongoose";

// This powers the OfferGrid component
// Each document = one grid card (Men, Women, Kids)
const offerGridSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      // e.g. "Men's Fashion | T-Shirts, Shirts & Formals"
    },

    category: {
      type: String,
      enum: ["men", "women", "kids"],
      required: true,
    },

    // 4 images shown in the grid card
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    displayOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("OfferGrid", offerGridSchema);