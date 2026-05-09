// import Razorpay from "razorpay";
// import crypto from "crypto";
// import dotenv from "dotenv";
// dotenv.config();


// if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
//   throw new Error("Razorpay keys are missing in environment variables");
// }
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // CREATE RAZORPAY ORDER
// export const createRazorpayOrder = async ({ amount, receipt }) => {
//   const order = await razorpay.orders.create({
//     amount: amount * 100, // INR → paise
//     currency: "INR",
//     receipt,
//   });

//   return order;
// };

// // VERIFY PAYMENT SIGNATURE
// export const verifyRazorpaySignature = ({
//   razorpayOrderId,
//   razorpayPaymentId,
//   razorpaySignature,
// }) => {
//   const body = `${razorpayOrderId}|${razorpayPaymentId}`;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(body)
//     .digest("hex");

//   return expectedSignature === razorpaySignature;
// };

import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay keys are missing in environment variables");
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ CREATE RAZORPAY ORDER (AMOUNT MUST BE IN PAISE)
export const createRazorpayOrder = async ({ amount, receipt }) => {
  try {
    console.log("RAZORPAY ORDER AMOUNT (PAISE):", amount);

    const order = await razorpay.orders.create({
      amount,          // paise
      currency: "INR",
      receipt,
    });

    return order;
  } catch (err) {
    console.error("❌ RAZORPAY ERROR:", err);

    // VERY IMPORTANT: expose Razorpay message
    throw new Error(
      err?.error?.description || "Razorpay order creation failed"
    );
  }
};

// ✅ VERIFY PAYMENT SIGNATURE
export const verifyRazorpaySignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === razorpaySignature;
};