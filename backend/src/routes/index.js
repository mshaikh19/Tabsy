const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");

// Mount sub-routers
router.use("/auth", authRoutes);

module.exports = router;
