// 

import User from "../../../models/User.js";

// Get all users (with search + pagination)
export const getAllUsersService = async (query) => {
  const { search, page = 1, limit = 10 } = query;

  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  return users;
};

// Get single user by ID
export const getUserByIdService = async (id) => {
  return await User.findById(id);
};

// Update user
export const updateUserService = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// Delete user
export const deleteUserService = async (id) => {
  return await User.findByIdAndDelete(id);
};

// Toggle block / unblock user
export const toggleUserStatusService = async (id) => {
  const user = await User.findById(id);

  if (!user) return null;

  user.isBlocked = !user.isBlocked;

  await user.save();

  return user;
};

// Change user role
export const changeUserRoleService = async (id, role) => {
  return await User.findByIdAndUpdate(
    id,
    { role },
    { new: true }
  );
};

// Verify user email manually
export const verifyUserEmailService = async (id) => {
  return await User.findByIdAndUpdate(
    id,
    { isEmailVerified: true },
    { new: true }
  );
};
