import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true, unique: true },

    role: { type: String, default: "VENDOR" },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    // OTP login fields
    emailOtp: { type: String },
    emailOtpExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);

