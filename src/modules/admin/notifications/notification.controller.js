import {
  getAllNotificationsService,
  getUnreadCountService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
} from "./notification.service.js";

// Get all notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await getAllNotificationsService();
    return res.json({ success: true, data: notifications });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await getUnreadCountService();
    return res.json({ success: true, count });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Mark one as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await markNotificationAsReadService(id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    await markAllNotificationsAsReadService();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};