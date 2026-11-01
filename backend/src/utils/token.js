const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "tabsy-default-access-secret-32-chars-long";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "tabsy-default-refresh-secret-32-chars-long";
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      currency: user.currency,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

const setRefreshTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: "/api/v1/auth",
  });
};

const clearRefreshTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/api/v1/auth",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
