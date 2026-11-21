const expenseService = require("../services/expense.service");

const listGroupExpenses = async (req, res, next) => {
  try {
    const result = await expenseService.listExpenses(req.user._id, req.params.id, req.query);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const listAllExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseService.listAllUserExpenses(req.user._id, req.query);
    res.status(200).json({ status: "success", results: expenses.length, data: { expenses } });
  } catch (error) {
    next(error);
  }
};

const getExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.getExpense(req.user._id, req.params.expenseId);
    res.status(200).json({ status: "success", data: { expense } });
  } catch (error) {
    next(error);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.user._id, req.params.id, req.body);
    res.status(201).json({ status: "success", data: { expense } });
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.updateExpense(req.user._id, req.params.expenseId, req.body);
    res.status(200).json({ status: "success", data: { expense } });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const result = await expenseService.deleteExpense(req.user._id, req.params.expenseId);
    res.status(200).json({ status: "success", message: result.message });
  } catch (error) {
    next(error);
  }
};

const updateParticipants = async (req, res, next) => {
  try {
    const expense = await expenseService.updateExpenseParticipants(
      req.user._id,
      req.params.expenseId,
      req.body.participants,
    );
    res.status(200).json({ status: "success", data: { expense } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listGroupExpenses,
  listAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  updateParticipants,
};