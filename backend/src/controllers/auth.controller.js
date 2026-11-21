const authService = require("../services/auth.service");
const { setRefreshTokenCookie, clearRefreshTokenCookie, generateAccessToken, generateRefreshToken } = require("../utils/token");
const User = require("../models/User");

const handleOAuthCallback = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    const tokenPayload = { id: user._id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.redirect(`${process.env.FRONTEND_URL}/onboarding?accessToken=${accessToken}`);
  } catch (error) {
    next(error);
  }
};

const googleCallback = (req, res, next) => handleOAuthCallback(req, res, next);

const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ status: "error", message: "Google credential is required" });
    }
    const { user, accessToken, refreshToken } = await authService.loginWithGoogle(credential);
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      status: "success",
      data: { user, accessToken },
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      status: "success",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      status: "success",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    // Refresh token comes from httpOnly cookie or fallback from body
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const { accessToken, user } = await authService.refresh(token);

    res.status(200).json({
      status: "success",
      data: {
        accessToken,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (req.user) {
      await authService.logout(req.user._id, token);
    }
    clearRefreshTokenCookie(res);

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const deleteMe = async (req, res, next) => {
  try {
    const result = await authService.deleteAccount(req.user._id);
    clearRefreshTokenCookie(res);
    res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body);
    res.status(200).json({ status: "success", message: result.message, data: { devToken: result.devToken } });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).json({ status: "success", message: result.message });
  } catch (error) {
    next(error);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const result = await authService.sendEmailVerification(req.user._id);
    res.status(200).json({ status: "success", message: result.message, data: { devOtp: result.devOtp } });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const result = await authService.verifyEmail(req.body);
    res.status(200).json({ status: "success", message: result.message, data: { user: result.user } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateMe,
  deleteMe,
  forgotPassword,
  resetPassword,
  resendVerification,
  verifyEmail,
  googleCallback,
  googleLogin,
};
