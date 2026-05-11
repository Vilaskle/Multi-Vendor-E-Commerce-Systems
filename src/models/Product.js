
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

 status: {
  type: String,
  enum: ["PENDING", "APPROVED", "REJECTED"],
  default: "PENDING",
},

isActive: {
  type: Boolean,
  default: true,
},
rejectionReason: {
  type: String,
  default: null,
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
    
  // Add these 3 fields after the existing `stock` field:



// ── ADD THESE 3 ──────────────────────────────
lowStockThreshold: {
  type: Number,
  default: 5,
  min: 1,
},

stockStatus: {
  type: String,
  enum: ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"],
  default: "IN_STOCK",
},

// rejectionReason: {
//   type: String,
//   default: "",
// },
// ─────────────────────────────────────────────
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
