const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  updateProfileSchema,
  updatePreferencesSchema,
  completeOnboardingSchema,
} = require("../validators/user.validator");

router.use(authenticate);

router.get("/peers", userController.listPeers);
router.get("/search", userController.searchUsers);
router.patch("/me", validate(updateProfileSchema), userController.updateProfile);
router.patch(
  "/me/preferences",
  validate(updatePreferencesSchema),
  userController.updatePreferences,
);
router.post(
  "/me/onboarding",
  validate(completeOnboardingSchema),
  userController.completeOnboarding,
);

module.exports = router;