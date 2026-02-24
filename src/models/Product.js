
// // src/models/Product.js
// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },

//     category: {
//   type: String,
//   enum: ["Men", "Women", "Kids"],
//   required: true,
// },


//     productType: { type: String, required: true },

//     price: { type: Number, required: true },

//     quantity: { type: Number, required: true },

//     sizes: { type: [String], required: true },

//     colors: { type: [String], required: true },

//     images: [
//       {
//         url: { type: String, required: true },
//         public_id: { type: String, required: true },
//       },
//     ],

//     vendor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Vendor",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// /* ================= INDEXES ================= */

// // 1️⃣ Category filtering
// productSchema.index({ category: 1 });

// // 2️⃣ Price filtering & sorting
// productSchema.index({ price: 1 });

// // 3️⃣ Search by product name (TEXT search)
// productSchema.index({ name: "text" });

// // 4️⃣ Newest products sorting
// productSchema.index({ createdAt: -1 });

// /* =========================================== */


// export default mongoose.model("Product", productSchema);




import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Men", "Women", "Kids"],
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    sizes: {
      type: [String],
      required: true,
      default: [],
    },

    colors: {
      type: [String],
      required: true,
      default: [],
    },

    /* ================= RATING (NEW) ================= */
    rating: {
      type: Number,
      default: 0,     // average rating
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ================= IMAGES ================= */
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
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

/* ================= INDEXES ================= */
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ discount: -1 });
productSchema.index({ rating: -1 });        // ⭐ sort/filter by rating
productSchema.index({
  name: "text",
  category: "text",
  tags: "text",
});
productSchema.index({ createdAt: -1 });


export default mongoose.model("Product", productSchema);
