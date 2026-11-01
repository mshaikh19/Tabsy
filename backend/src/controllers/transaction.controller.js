const transactionService = require("../services/transaction.service");

const getTransactions = async (req, res, next) => {
  try {
    const result = await transactionService.getTransactions(req.user._id, req.query);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.user._id,
      req.params.id,
    );
    res.status(200).json({
      status: "success",
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(
      req.user._id,
      req.body,
    );
    res.status(201).json({
      status: "success",
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(
      req.user._id,
      req.params.id,
      req.body,
    );
    res.status(200).json({
      status: "success",
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const result = await transactionService.deleteTransaction(
      req.user._id,
      req.params.id,
    );
    res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
