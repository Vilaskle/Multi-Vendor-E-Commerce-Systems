import Notification from "../../../models/Notification.js";

/**
 * Create a new notification
 */
export const createNotification = async ({
  type,
  message,
  relatedId = null,
}) => {
  try {
    const notification = await Notification.create({
      type,
      message,
      relatedId,
      isRead: false,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error.message);
    throw new Error("Notification creation failed");
  }
};

/**
 * Get all notifications (latest first)
 */
export const getAllNotificationsService = async () => {
  try {
    return await Notification.find().sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Failed to fetch notifications");
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCountService = async () => {
  try {
    return await Notification.countDocuments({ isRead: false });
  } catch (error) {
    throw new Error("Failed to get unread count");
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsReadService = async (id) => {
  try {
    return await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
  } catch (error) {
    throw new Error("Failed to mark notification as read");
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsReadService = async () => {
  try {
    return await Notification.updateMany(
      { isRead: false },
      { isRead: true }
    );
  } catch (error) {
    throw new Error("Failed to mark all as read");
  }
};