const Notification = require("../models/Notification");

const listNotifications = async (userId) => {
  const items = await Notification.find({ userId }).sort({ createdAt: -1 }).lean();
  const unread = items.filter((n) => !n.read).length;
  return { items, unread };
};

const markRead = async (userId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { $set: { read: true } },
    { new: true },
  );
  if (!notification) {
    const { AppError } = require("../middleware/error.middleware");
    throw new AppError("Notification not found", 404, "NOTIFICATION_NOT_FOUND");
  }
  return notification;
};

const markAllRead = async (userId) => {
  await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
  return { message: "All notifications marked as read" };
};

const createNotification = async (data) => {
  return Notification.create(data);
};

module.exports = {
  listNotifications,
  markRead,
  markAllRead,
  createNotification,
};