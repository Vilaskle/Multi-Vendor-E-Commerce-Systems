import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
    },

    image: {
      url: String,
      public_id: String,
    },

     displayOrder: { type: Number, default: 0 },

    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: { type: Number, default: 0 },
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);