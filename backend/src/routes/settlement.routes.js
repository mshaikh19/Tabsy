const express = require("express");
const router = express.Router();
const settlementController = require("../controllers/settlement.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { updateSettlementSchema } = require("../validators/settlement.validator");
const { groupParams } = require("../validators/misc.validator");

router.use(authenticate);

router.get("/:id", validate(groupParams), settlementController.listSettlements);
router.patch(
  "/:id/:settlementId",
  validate(updateSettlementSchema),
  settlementController.updateSettlement,
);

module.exports = router;