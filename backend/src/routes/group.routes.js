const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group.controller");
const expenseController = require("../controllers/expense.controller");
const balanceController = require("../controllers/balance.controller");
const settlementController = require("../controllers/settlement.controller");
const activityController = require("../controllers/activity.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createGroupSchema,
  updateGroupSchema,
  addMembersSchema,
  updateMemberRoleSchema,
  removeMemberSchema,
  joinInviteSchema,
} = require("../validators/group.validator");
const {
  createExpenseSchema,
  listExpensesQuerySchema,
} = require("../validators/expense.validator");
const {
  createSettlementSchema,
  settleDebtSchema,
} = require("../validators/settlement.validator");
const { groupParams } = require("../validators/misc.validator");

router.use(authenticate);

router.post("/join", validate(joinInviteSchema), groupController.joinByInvite);
router.get("/", groupController.listGroups);
router.post("/", validate(createGroupSchema), groupController.createGroup);

router.get("/:id", validate(groupParams), groupController.getGroup);
router.patch("/:id", validate(updateGroupSchema), groupController.updateGroup);
router.delete("/:id", validate(groupParams), groupController.deleteGroup);

// Members
router.get("/:id/members", validate(groupParams), groupController.listMembers);
router.post("/:id/members", validate(addMembersSchema), groupController.addMembers);
router.patch(
  "/:id/members/:userId/role",
  validate(updateMemberRoleSchema),
  groupController.updateMemberRole,
);
router.delete(
  "/:id/members/:userId",
  validate(removeMemberSchema),
  groupController.removeMember,
);

// Leave
router.post("/:id/leave", validate(groupParams), groupController.leaveGroup);

// Expenses (group scoped)
router.get(
  "/:id/expenses",
  validate(listExpensesQuerySchema),
  expenseController.listGroupExpenses,
);
router.post(
  "/:id/expenses",
  validate(createExpenseSchema),
  expenseController.createExpense,
);

// Balances
router.get("/:id/balances", validate(groupParams), balanceController.getGroupBalances);
router.get("/:id/balances/plan", validate(groupParams), balanceController.getGroupPlan);
router.get("/:id/balances/peers", validate(groupParams), balanceController.getPeerMatrix);
router.post("/:id/settle", validate(settleDebtSchema), balanceController.settle);

// Settlements
router.get("/:id/settlements", validate(groupParams), settlementController.listSettlements);
router.post(
  "/:id/settlements",
  validate(createSettlementSchema),
  settlementController.createSettlement,
);

// Activity
router.get("/:id/activity", validate(groupParams), activityController.listGroupActivity);

module.exports = router;