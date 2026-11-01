const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const { AppError } = require("../middleware/error.middleware");

const getTransactions = async (userId, queryParams) => {
  const {
    page = 1,
    limit = 20,
    startDate,
    endDate,
    from,
    to,
    type,
    categoryId,
    minAmount,
    maxAmount,
    search,
    sortBy = "date",
    sortOrder = "desc",
  } = queryParams;

  const filter = { userId };

  // Date range filter
  const fromDate = from || startDate;
  const toDate = to || endDate;
  if (fromDate || toDate) {
    filter.date = {};
    if (fromDate) {
      filter.date.$gte = new Date(fromDate);
    }
    if (toDate) {
      const end = new Date(toDate);
      // If date string only (YYYY-MM-DD), set to end of that day
      if (toDate.length === 10) {
        end.setHours(23, 59, 59, 999);
      }
      filter.date.$lte = end;
    }
  }

  // Type filter
  if (type) {
    filter.type = type;
  }

  // Category filter
  if (categoryId) {
    filter.categoryId = categoryId;
  }

  // Amount range filter (stored in smallest unit)
  if (minAmount !== undefined || maxAmount !== undefined) {
    filter.amount = {};
    if (minAmount !== undefined) filter.amount.$gte = Number(minAmount);
    if (maxAmount !== undefined) filter.amount.$lte = Number(maxAmount);
  }

  // Keyword search on note
  if (search && search.trim()) {
    filter.note = { $regex: search.trim(), $options: "i" };
  }

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate("categoryId", "name color icon isDefault")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  return {
    transactions,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

const getTransactionById = async (userId, transactionId) => {
  const transaction = await Transaction.findOne({ _id: transactionId, userId })
    .populate("categoryId", "name color icon isDefault");

  if (!transaction) {
    throw new AppError("Transaction not found", 404, "TRANSACTION_NOT_FOUND");
  }

  return transaction;
};

const createTransaction = async (userId, transactionData) => {
  // Verify category exists and is accessible by this user
  const category = await Category.findOne({
    _id: transactionData.categoryId,
    $or: [{ userId }, { userId: null }],
    isArchived: false,
  });

  if (!category) {
    throw new AppError("Category not found or archived", 400, "INVALID_CATEGORY");
  }

  const transaction = new Transaction({
    ...transactionData,
    userId,
    date: transactionData.date ? new Date(transactionData.date) : new Date(),
  });

  await transaction.save();
  return transaction.populate("categoryId", "name color icon isDefault");
};

const updateTransaction = async (userId, transactionId, updateData) => {
  const transaction = await Transaction.findOne({ _id: transactionId, userId });

  if (!transaction) {
    throw new AppError("Transaction not found", 404, "TRANSACTION_NOT_FOUND");
  }

  if (updateData.categoryId) {
    const category = await Category.findOne({
      _id: updateData.categoryId,
      $or: [{ userId }, { userId: null }],
      isArchived: false,
    });

    if (!category) {
      throw new AppError("Category not found or archived", 400, "INVALID_CATEGORY");
    }
    transaction.categoryId = updateData.categoryId;
  }

  if (updateData.type !== undefined) transaction.type = updateData.type;
  if (updateData.amount !== undefined) transaction.amount = updateData.amount;
  if (updateData.date !== undefined) transaction.date = new Date(updateData.date);
  if (updateData.paymentMethod !== undefined) transaction.paymentMethod = updateData.paymentMethod;
  if (updateData.note !== undefined) transaction.note = updateData.note;
  if (updateData.receiptUrl !== undefined) transaction.receiptUrl = updateData.receiptUrl;

  await transaction.save();
  return transaction.populate("categoryId", "name color icon isDefault");
};

const deleteTransaction = async (userId, transactionId) => {
  const transaction = await Transaction.findOneAndDelete({ _id: transactionId, userId });

  if (!transaction) {
    throw new AppError("Transaction not found", 404, "TRANSACTION_NOT_FOUND");
  }

  return { message: "Transaction deleted successfully" };
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
