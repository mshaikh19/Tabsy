const dashboardService = require("../services/dashboard.service");

const getOverview = async (req, res, next) => {
  try {
    const overview = await dashboardService.getOverview(req.user._id);
    res.status(200).json({ status: "success", data: overview });
  } catch (error) {
    next(error);
  }
};

const getTabs = async (req, res, next) => {
  try {
    const tabs = await dashboardService.getTabs(req.user._id);
    res.status(200).json({ status: "success", results: tabs.length, data: { tabs } });
  } catch (error) {
    next(error);
  }
};

const getGraphPlan = async (req, res, next) => {
  try {
    const plan = await dashboardService.getGraphPlan(req.user._id);
    res.status(200).json({ status: "success", data: plan });
  } catch (error) {
    next(error);
  }
};

const getLiveFeed = async (req, res, next) => {
  try {
    const feed = await dashboardService.getLiveFeed(req.user._id);
    res.status(200).json({ status: "success", results: feed.length, data: { feed } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getTabs,
  getGraphPlan,
  getLiveFeed,
};