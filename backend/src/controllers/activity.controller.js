const activityService = require("../services/activity.service");

const listUserActivity = async (req, res, next) => {
  try {
    const result = await activityService.listUserActivity(req.user._id);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const listGroupActivity = async (req, res, next) => {
  try {
    const result = await activityService.listGroupActivity(req.user._id, req.params.id);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listUserActivity,
  listGroupActivity,
};