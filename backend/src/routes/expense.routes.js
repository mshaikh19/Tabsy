const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  updateExpenseSchema,
  expenseParamsSchema,
  updateParticipantsSchema,
} = require("../validators/expense.validator");

router.use(authenticate);

router.get("/", expenseController.listAllExpenses);
router.get("/:expenseId", validate(expenseParamsSchema), expenseController.getExpense);
router.patch("/:expenseId", validate(updateExpenseSchema), expenseController.updateExpense);
router.delete("/:expenseId", validate(expenseParamsSchema), expenseController.deleteExpense);
router.patch(
  "/:expenseId/participants",
  validate(updateParticipantsSchema),
  expenseController.updateParticipants,
);

module.exports = router;