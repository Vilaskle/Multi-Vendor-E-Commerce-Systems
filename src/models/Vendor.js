// import mongoose from "mongoose";

// const vendorSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phoneNo: { type: String, required: true, unique: true },

//     role: { type: String, default: "VENDOR" },

//     // ✅ Approval Status (Admin controls this)
//     status: {
//       type: String,
//       enum: ["PENDING", "APPROVED", "REJECTED"],
//       default: "PENDING",
//     },

//     // ✅ Document Details
//     gstNumber: { type: String, required: true, unique: true}, // GST entered manually

//     shopLicense: {
//       url: String,        // uploaded file URL
//       public_id: String,
//     },

//     // ✅ Track admin decision
//     rejectionReason: { type: String },
//     approvedAt: { type: Date },

//     // OTP login fields
//     emailOtp: { type: String },
//     emailOtpExpiry: { type: Date },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Vendor", vendorSchema);







import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true, unique: true },

    role: { type: String, default: "VENDOR" },

    // ✅ Approval Status (Admin controls this)
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    // ✅ Document Details
    gstNumber: { type: String, required: true, unique: true },

    shopLicense: {
      url: String,
      public_id: String,
    },

    // ✅ Delivery & Wallet
    deliveryCharge: {
      type: Number,
      default: 40,
    },
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
    },

    // ✅ Bank Details (filled after registration)
    bankDetails: {
      accountHolderName: { type: String, default: null },
      accountNumber:     { type: String, default: null },
      ifsc:              { type: String, default: null },
    },

    // ✅ Razorpay Payout
    razorpayContactId: { type: String, default: null },
    fundAccountId:     { type: String, default: null },

    // ✅ Track admin decision
    rejectionReason: { type: String },
    approvedAt: { type: Date },

    // ✅ OTP login fields
    emailOtp: { type: String },
    emailOtpExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);