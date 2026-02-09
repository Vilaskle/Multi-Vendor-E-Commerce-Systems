
import User from "../../models/User.js";

export const getUserProfileService = async (userId) => {
  const user = await User.findById(userId).select(
    "-emailOtp -emailOtpExpiry"
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

