
// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     orders: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Order",
//       },
//     ],

//     razorpayOrderId: String,
//     razorpayPaymentId: String,
//     razorpaySignature: String,

//     amount: Number,

//     status: {
//       type: String,
//       enum: ["CREATED", "SUCCESS", "FAILED"],
//       default: "CREATED",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Payment", paymentSchema);







import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    itemsTotal: Number,
deliveryTotal: Number,

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    amount: Number,

    status: {
  type: String,
  enum: ["PENDING", "SUCCESS", "FAILED"], // ✅ UPDATED
  default: "PENDING",
},
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);