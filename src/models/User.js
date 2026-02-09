
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     phoneNo: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     address: { type: String, required: true },

//     // OTP login fields
//     emailOtp: { type: String },
//     emailOtpExpiry: { type: Date },

//     role: { type: String, default: "USER" }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phoneNo: { type: String },
    address: { type: String },

    password: {
      type: String,
      required: true,
      select: false, // 🔐 never return by default
    },
    role: { type: String, default: "USER"},
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailOtp: { type: String },
    emailOtpExpiry: { type: Date },
    resetPasswordOtp: { type: String },
    resetPasswordOtpExpiry: { type: Date },

    
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
