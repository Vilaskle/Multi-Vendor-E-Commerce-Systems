import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  toggleUserStatusService,
  changeUserRoleService,
  verifyUserEmailService,
} from "./user.service.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService(req.query);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await updateUserService(
      req.params.id,
      req.body
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await deleteUserService(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};

// ==============================
// Toggle Block / Unblock User
// ==============================
export const toggleUserStatus = async (req, res) => {
  try {

    const user = await toggleUserStatusService(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "User has been blocked"
        : "User has been unblocked",
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error updating user status"
    });

  }
};


// ==============================
// Change User Role
// ==============================
export const changeUserRole = async (req, res) => {
  try {

    const user = await changeUserRoleService(
      req.params.id,
      req.body.role
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error changing user role"
    });

  }
};


// ==============================
// Verify User Email
// ==============================
export const verifyUserEmail = async (req, res) => {
  try {

    const user = await verifyUserEmailService(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }


    if (!user.isEmailVerified) {
     return res.status(403).json({
      success: false,
      message: "Please verify your email first"
     });
  }

    res.status(200).json({
      success: true,
      message: "User email verified successfully",
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error verifying email"
    });

  }
};