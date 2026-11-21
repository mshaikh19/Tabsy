const balanceService = require("../services/balance.service");
const settlementService = require("../services/settlement.service");

const getOverview = async (req, res, next) => {
  try {
    const overview = await balanceService.getUserNetPosition(req.user._id);
    res.status(200).json({ status: "success", data: overview });
  } catch (error) {
    next(error);
  }
};

const getGroupBalances = async (req, res, next) => {
  try {
    const position = await balanceService.getUserGroupPosition(req.user._id, req.params.id);
    const plan = await balanceService.getSettlementPlan(req.params.id);
    const matrix = await balanceService.getGroupPeerMatrix(req.user._id, req.params.id);
    res.status(200).json({ status: "success", data: { position, plan, matrix } });
  } catch (error) {
    next(error);
  }
};

const getGroupPlan = async (req, res, next) => {
  try {
    const plan = await balanceService.getSettlementPlan(req.params.id);
    res.status(200).json({ status: "success", data: { plan } });
  } catch (error) {
    next(error);
  }
};

const getPeerMatrix = async (req, res, next) => {
  try {
    const matrix = await balanceService.getGroupPeerMatrix(req.user._id, req.params.id);
    res.status(200).json({ status: "success", data: matrix });
  } catch (error) {
    next(error);
  }
};

const settle = async (req, res, next) => {
  try {
    const settlement = await settlementService.settleDebt(req.user._id, req.params.id, req.body);
    res.status(201).json({ status: "success", data: { settlement } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getGroupBalances,
  getGroupPlan,
  getPeerMatrix,
  settle,
};