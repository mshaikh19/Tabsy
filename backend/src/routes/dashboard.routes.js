const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const authenticate = require("../middleware/auth.middleware");

router.use(authenticate);

router.get("/overview", dashboardController.getOverview);
router.get("/tabs", dashboardController.getTabs);
router.get("/graph-plan", dashboardController.getGraphPlan);
router.get("/live-feed", dashboardController.getLiveFeed);

module.exports = router;