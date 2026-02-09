
import {registerUserService,
  requestUserLoginOtpService,
  verifyUserLoginOtpService,getUserProfileService,
  updateUserProfileService,
} from "./user.service.js";


export const registerUser = async (req, res) => {
  try {
    const { name, phoneNo, email, address } = req.body;

    const result = await registerUserService({
      name,
      phoneNo,
      email,
      address,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
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