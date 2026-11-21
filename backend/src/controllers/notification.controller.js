const notificationService = require("../services/notification.service");

const listNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.listNotifications(req.user._id);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const markRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markRead(req.user._id, req.params.id);
    res.status(200).json({ status: "success", data: { notification } });
  } catch (error) {
    next(error);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllRead(req.user._id);
    res.status(200).json({ status: "success", message: result.message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listNotifications,
  markRead,
  markAllRead,
};