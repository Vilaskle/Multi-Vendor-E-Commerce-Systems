
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
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNo: {
      type: String,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔐 never return password by default
    },

    role: {
      type: String,
      enum: ["USER"], // since admin is separate
      default: "USER",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    profileImage: {
      type: String, // store image URL
    },

    // 📍 Multiple Addresses
    addresses: [
      {
        fullName: String,
        phoneNo: String,
        addressLine: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: { type: Boolean, default: false },
      },
    ],

    // 🛒 Cart
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    // ❤️ Wishlist
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // 🔐 OTP fields
    emailOtp: String,
    emailOtpExpiry: Date,
    resetPasswordOtp: String,
    resetPasswordOtpExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);