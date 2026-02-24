// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import { sendEmailOtp } from "../services/email/email.service.js";


// const generateOtp = () =>
//   Math.floor(100000 + Math.random() * 900000).toString();

// export const registerUserService = async ({
//   name,
//   phoneNo,
//   email,
//   address,
// }) => {
//   // Check if phone already exists
//   const existingUser = await User.findOne({ phoneNo });

//   if (existingUser) {
//     throw new Error("Phone number already registered");
//   }

//   // Create new user
//   const newUser = await User.create({
//     name,
//     phoneNo,
//     email,
//     address,
//   });

//   return {
//     id: newUser._id,
//     name: newUser.name,
//     phoneNo: newUser.phoneNo,
//     address:newUser.address
//   };
// };


// // STEP 1: REQUEST OTP
// export const requestUserLoginOtpService = async (email) => {
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const otp = generateOtp();
//   const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

//   user.emailOtp = otp;
//   user.emailOtpExpiry = expiry;
//   await user.save();

//   await sendEmailOtp(email, otp);
// };

// // STEP 2: VERIFY OTP
// export const verifyUserLoginOtpService = async (email, otp) => {
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   if (
//     user.emailOtp !== otp ||
//     user.emailOtpExpiry < new Date()
//   ) {
//     throw new Error("Invalid or expired OTP");
//   }

//   // Clear OTP
//   user.emailOtp = null;
//   user.emailOtpExpiry = null;
//   await user.save();

//   // Generate JWT
//   const token = jwt.sign(
//     { userId: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   return {
//     token,
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email
//     }
//   };



// };




import User from "../models/User.js";
import jwt from "jsonwebtoken";
//import  {sendEmailOtp} from "../services/email/email.service.js";
import { sendOtpEmail } from "../services/email/email.service.js";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const registerUserService = async ({
  name,
  phoneNo,
  email,
  address,
}) => {
  // Check if phone already exists
  const existingUser = await User.findOne({ phoneNo });

  if (existingUser) {
    throw new Error("Phone number already registered");
  }

  // Create new user
  const newUser = await User.create({
    name,
    phoneNo,
    email,
    address,
  });

  return {
    id: newUser._id,
    name: newUser.name,
    phoneNo: newUser.phoneNo,
    address:newUser.address
  };
};


// STEP 1: REQUEST OTP
export const requestUserLoginOtpService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOtp();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  user.emailOtp = otp;
  user.emailOtpExpiry = expiry;
  await user.save();

  await sendOtpEmail(email, otp);
};

// STEP 2: VERIFY OTP
export const verifyUserLoginOtpService = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (
    user.emailOtp !== otp ||
    user.emailOtpExpiry < new Date()
  ) {
    throw new Error("Invalid or expired OTP");
  }

  // Clear OTP
  user.emailOtp = null;
  user.emailOtpExpiry = null;
  await user.save();

  // Generate JWT
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  };



};