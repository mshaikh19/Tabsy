const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const transactionRoutes = require("./transaction.routes");
const groupRoutes = require("./group.routes");
const expenseRoutes = require("./expense.routes");
const balanceRoutes = require("./balance.routes");
const settlementRoutes = require("./settlement.routes");
const activityRoutes = require("./activity.routes");
const notificationRoutes = require("./notification.routes");
const dashboardRoutes = require("./dashboard.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/transactions", transactionRoutes);
router.use("/groups", groupRoutes);
router.use("/expenses", expenseRoutes);
router.use("/balances", balanceRoutes);
router.use("/settlements", settlementRoutes);
router.use("/activity", activityRoutes);
router.use("/notifications", notificationRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;