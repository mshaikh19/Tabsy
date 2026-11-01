const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createTransactionSchema,
  updateTransactionSchema,
  getTransactionsQuerySchema,
} = require("../validators/transaction.validator");

// All transaction routes require authentication
router.use(authenticate);

router.get("/", validate(getTransactionsQuerySchema), transactionController.getTransactions);
router.post("/", validate(createTransactionSchema), transactionController.createTransaction);
router.get("/:id", transactionController.getTransactionById);
router.put("/:id", validate(updateTransactionSchema), transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
