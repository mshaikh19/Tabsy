const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { authRateLimiter } = require("../middleware/rateLimiter.middleware");
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} = require("../validators/auth.validator");

// Public auth endpoints with rate limiting
router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  authController.register,
);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  authController.login,
);

router.post(
  "/refresh",
  authController.refresh,
);

router.post(
  "/logout",
  (req, res, next) => {
    // Optional auth extraction so logout works even if access token is already expired
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authenticate(req, res, (err) => {
        // Continue to logout even if access token verification fails
        next();
      });
    }
    next();
  },
  authController.logout,
);

// Protected profile routes
router.get("/me", authenticate, authController.getMe);
router.patch("/me", authenticate, validate(updateProfileSchema), authController.updateMe);
router.delete("/me", authenticate, authController.deleteMe);

module.exports = router;
