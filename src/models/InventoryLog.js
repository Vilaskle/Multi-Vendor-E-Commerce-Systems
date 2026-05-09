import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    change: {
      type: Number,
      required: true, // +50 added, -10 sold, -2 cancelled
    },
    reason: {
      type: String,
      enum: ["MANUAL_ADD", "MANUAL_REDUCE", "ORDER_PLACED", "ORDER_CANCELLED"],
      required: true,
    },
    // note: {
    //   type: String,
    //   default: "",
    // },
    stockBefore: {
      type: Number,
      required: true,
    },
    stockAfter: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

inventoryLogSchema.index({ product: 1, createdAt: -1 });
inventoryLogSchema.index({ vendor: 1, createdAt: -1 });

export default mongoose.model("InventoryLog", inventoryLogSchema);