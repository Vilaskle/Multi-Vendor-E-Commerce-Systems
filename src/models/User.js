
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },

    // OTP login fields
    emailOtp: { type: String },
    emailOtpExpiry: { type: Date },

    role: { type: String, default: "USER" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
