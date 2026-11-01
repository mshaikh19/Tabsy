const authService = require("../services/auth.service");
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require("../utils/token");

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

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateMe,
  deleteMe,
};
