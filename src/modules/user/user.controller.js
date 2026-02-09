
import {registerUserService,
  verifyEmailOtpService ,
  loginWithPasswordService ,
  requestUserLoginOtpService,
  verifyUserLoginOtpService,
  forgotPasswordService , resetPasswordService ,resendOtpService ,
  getUserProfileService,
  updateUserProfileService,
} from "./user.service.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phoneNo, address } =
      req.body;

    const result = await registerUserService({
      name,
      email,
      password,
      confirmPassword,
      phoneNo,
      address,
    });

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please verify your email using the OTP sent.",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await verifyEmailOtpService({ email, otp });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//login-password
export const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginWithPasswordService({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// STEP 1: REQUEST OTP
export const requestUserLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    await requestUserLoginOtpService(email);

    res.json({
      success: true,
      message: "OTP sent to email"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


// STEP 2: VERIFY OTP
export const verifyUserLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const data = await verifyUserLoginOtpService(email, otp);

    res.json({
      success: true,
      message: "Login successful",
      data
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await forgotPasswordService({ email });

    res.status(200).json({
      success: true,
      message: "OTP sent to email for password reset",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    const result = await resetPasswordService({
      email,
      otp,
      newPassword,
      confirmPassword,
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login again.",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


export const resendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;

    const result = await resendOtpService({ email, type });

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await getUserProfileService(userId);

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, address } = req.body;

    const updatedUser = await updateUserProfileService(userId, {
      name,
      address,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};