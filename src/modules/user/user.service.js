import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import  sendOtpEmail  from "../../services/email/email.service.js";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const registerUserService = async ({
  name,
  email,
  password,
  confirmPassword,
  phoneNo,
  address,
}) => {
  // 1. Basic validation
  if (!name || !email || !password || !confirmPassword) {
    throw new Error("All required fields must be provided");
  }

  if (password !== confirmPassword) {
    throw new Error("Password and confirm password do not match");
  }

  // 2. Check if user already exists
  const existingUser = await User.findOne({ email }).select(
    "+isEmailVerified"
  );

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new Error("Email already registered");
    }

    // user exists but not verified → resend OTP
    const otp = generateOtp();
    existingUser.emailOtp = otp;
    existingUser.emailOtpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await existingUser.save();

    // await sendUserEmailOtp(email, otp);
      await sendOtpEmail({ to: email, otp, purpose: "REGISTER", role: "USER" });


    return {
      email,
      isEmailVerified: false,
      message: "OTP resent to email",
    };
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Generate OTP
  const otp = generateOtp();

  // 5. Create user (UNVERIFIED)
  const user = await User.create({
    name,
    email,
    phoneNo,
    address,
    password: hashedPassword,
    isEmailVerified: false,
    emailOtp: otp,
    emailOtpExpiry: new Date(Date.now() + 5 * 60 * 1000),
  });

  // 6. Send OTP email
  // await sendUserEmailOtp(email, otp);
    await sendOtpEmail({ to: email, otp, purpose: "REGISTER", role: "USER" });


  return {
    id: user._id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
  };
};


export const verifyEmailOtpService = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    throw new Error("Email already verified");
  }

  if (!user.emailOtp || !user.emailOtpExpiry) {
    throw new Error("OTP not found. Please request a new one");
  }

  if (user.emailOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.emailOtpExpiry < new Date()) {
    throw new Error("OTP expired. Please request a new one");
  }

  // ✅ VERIFY USER
  user.isEmailVerified = true;
  user.emailOtp = null;
  user.emailOtpExpiry = null;

  await user.save();

  return {
    email: user.email,
    isEmailVerified: user.isEmailVerified,
  };
};


//login-password
export const loginWithPasswordService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // 1. Find user + include password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Check email verification
  if (!user.isEmailVerified) {
    throw new Error("Please verify your email before logging in");
  }

  // 3. Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // 4. Generate JWT (same style as OTP login)
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: "USER",
    },
  };
};


// STEP 1: REQUEST OTP
export const requestUserLoginOtpService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

   if (!user.isEmailVerified) {
    throw new Error("Please verify your email before logging in");
  }

  const otp = generateOtp();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  user.emailOtp = otp;
  user.emailOtpExpiry = expiry;
  await user.save();

  // await sendEmailOtp(email, otp);
  await sendOtpEmail({ to: email, otp, purpose: "LOGIN", role: "USER" });
  return {email};
};

// STEP 2: VERIFY OTP
export const verifyUserLoginOtpService = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

 if (user.emailOtp !== otp) {
  throw new Error("Invalid OTP");
}

if (user.emailOtpExpiry < new Date()) {
  throw new Error("OTP expired");
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

export const forgotPasswordService = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });

  // IMPORTANT: generic message to avoid email enumeration
  if (!user) {
    throw new Error("If the email exists, OTP will be sent");
  }

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email first");
  }

  // Generate OTP
  const otp = generateOtp();

  user.emailOtp = otp;
  user.emailOtpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  // Send OTP for reset password
  await sendOtpEmail({
    to: email,
    otp,
    purpose: "RESET_PASSWORD",
    role: "USER",
  });

  return {
    email,
  };
};

export const resetPasswordService = async ({
  email,
  otp,
  newPassword,
  confirmPassword,
}) => {
  if (!email || !otp || !newPassword || !confirmPassword) {
    throw new Error("All fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid request");
  }

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email first");
  }

  if (!user.emailOtp || !user.emailOtpExpiry) {
    throw new Error("OTP not found. Please request again");
  }

  if (user.emailOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.emailOtpExpiry < new Date()) {
    throw new Error("OTP expired. Please request again");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password & clear OTP
  user.password = hashedPassword;
  user.emailOtp = null;
  user.emailOtpExpiry = null;

  await user.save();

  return {
    email: user.email,
  };
};


export const resendOtpService = async ({ email, type }) => {
  if (!email || !type) {
    throw new Error("Email and type are required");
  }

  if (!["VERIFY_EMAIL", "RESET_PASSWORD"].includes(type)) {
    throw new Error("Invalid OTP type");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  // If verifying email but already verified
  if (type === "VERIFY_EMAIL" && user.isEmailVerified) {
    throw new Error("Email already verified");
  }

  // Generate new OTP
  const otp = generateOtp();

  user.emailOtp = otp;
  user.emailOtpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  // Decide email purpose
  const purpose =
    type === "VERIFY_EMAIL" ? "REGISTER" : "RESET_PASSWORD";

  await sendOtpEmail({
    to: email,
    otp,
    purpose,
    role: "USER",
  });

  return {
    email,
    type,
  };
};


export const getUserProfileService = async (userId) => {
  const user = await User.findById(userId).select(
    "-password -emailOtp -emailOtpExpiry"
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


export const updateUserProfileService = async (userId, updateData) => {
  const allowedFields = {};

  if (updateData.name) allowedFields.name = updateData.name;
  if (updateData.address) allowedFields.address = updateData.address;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: allowedFields },
    { new: true }
  ).select("-emailOtp -emailOtpExpiry");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

