const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balance.controller");
const authenticate = require("../middleware/auth.middleware");

router.use(authenticate);

router.get("/overview", balanceController.getOverview);

module.exports = router;