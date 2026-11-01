const { AppError } = require("./error.middleware");
const { verifyAccessToken } = require("../utils/token");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Authentication token is missing", 401, "UNAUTHORIZED"));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new AppError("Invalid authorization format", 401, "UNAUTHORIZED"));
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Access token expired", 401, "TOKEN_EXPIRED"));
      }
      return next(new AppError("Invalid access token", 401, "INVALID_TOKEN"));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User account no longer exists", 401, "USER_NOT_FOUND"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
