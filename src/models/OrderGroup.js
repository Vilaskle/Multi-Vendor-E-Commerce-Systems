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

export default mongoose.model("OrderGroup", orderGroupSchema);