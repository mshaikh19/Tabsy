const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const categoryRoutes = require("./category.routes");
const transactionRoutes = require("./transaction.routes");

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/transactions", transactionRoutes);

module.exports = router;
