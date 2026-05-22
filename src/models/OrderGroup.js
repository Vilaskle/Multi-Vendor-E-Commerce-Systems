import mongoose from "mongoose";

const orderGroupSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    }
  ],

  razorpayOrderId: String,

  totalAmount: Number,
  deliveryCharge: Number,

  paymentStatus: {
    type: String,
    enum: ["PENDING","PAID","FAILED"],
    default: "PENDING"
  }

},
{ timestamps: true }
);

orderGroupSchema.index({ user: 1, createdAt: -1 });
orderGroupSchema.index({ orders: 1 });
export default mongoose.model("OrderGroup", orderGroupSchema);