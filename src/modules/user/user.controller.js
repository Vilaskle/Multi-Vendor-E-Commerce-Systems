
import { getUserProfileService,
  updateUserProfileService,
} from "./user.service.js";

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