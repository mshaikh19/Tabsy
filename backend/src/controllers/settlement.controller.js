const settlementService = require("../services/settlement.service");

const listSettlements = async (req, res, next) => {
  try {
    const settlements = await settlementService.listSettlements(req.user._id, req.params.id);
    res.status(200).json({ status: "success", results: settlements.length, data: { settlements } });
  } catch (error) {
    next(error);
  }
};

const createSettlement = async (req, res, next) => {
  try {
    const settlement = await settlementService.createSettlement(req.user._id, req.params.id, req.body);
    res.status(201).json({ status: "success", data: { settlement } });
  } catch (error) {
    next(error);
  }
};

const updateSettlement = async (req, res, next) => {
  try {
    const settlement = await settlementService.updateSettlement(
      req.user._id,
      req.params.settlementId,
      req.body,
    );
    res.status(200).json({ status: "success", data: { settlement } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listSettlements,
  createSettlement,
  updateSettlement,
};