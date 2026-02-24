
// src/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    category: {
  type: String,
  enum: ["Men", "Women", "Kids"],
  required: true,
},


    productType: { type: String, required: true },

    price: { type: Number, required: true },

    quantity: { type: Number, required: true },

    sizes: { type: [String], required: true },

    colors: { type: [String], required: true },

    //   // ✅ Toggle
    // isActive: {
    //   type: Boolean,
    //   default: true,
    // },

    

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
