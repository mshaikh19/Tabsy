const userService = require("../services/user.service");

const listPeers = async (req, res, next) => {
  try {
    const peers = await userService.listPeers(req.user._id);
    res.status(200).json({ status: "success", results: peers.length, data: { peers } });
  } catch (error) {
    next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const users = await userService.searchUsers(req.user._id, req.query.q);
    res.status(200).json({ status: "success", results: users.length, data: { users } });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const user = await userService.updatePreferences(req.user._id, req.body);
    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    next(error);
  }
};

const completeOnboarding = async (req, res, next) => {
  try {
    const user = await userService.completeOnboarding(req.user._id, req.body);
    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listPeers,
  searchUsers,
  updateProfile,
  updatePreferences,
  completeOnboarding,
};