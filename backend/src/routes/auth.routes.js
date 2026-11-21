const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { authRateLimiter } = require("../middleware/rateLimiter.middleware");
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
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
  "/forgot-password",
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

router.post(
  "/reset-password",
  authRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword,
);

router.post(
  "/verify-email",
  authRateLimiter,
  validate(verifyEmailSchema),
  authController.verifyEmail,
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

// Direct OAuth token exchange endpoints (for frontend SDKs)
if (process.env.GOOGLE_CLIENT_ID) {
  router.post("/google", authController.googleLogin);
}

// OAuth routes (full redirect flow)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login?error=google_failed" }),
    authController.googleCallback
  );
}

// Protected profile routes
router.get("/me", authenticate, authController.getMe);
router.patch("/me", authenticate, validate(updateProfileSchema), authController.updateMe);
router.post("/resend-verification", authenticate, authController.resendVerification);
router.delete("/me", authenticate, authController.deleteMe);

module.exports = router;
