class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_SERVER_ERROR", details = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || (statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "BAD_REQUEST");
  const message = err.message || "An unexpected error occurred.";
  const details = err.details || [];

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    console.error("Unhandled Error:", err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      details,
    },
  });
};

module.exports = {
  AppError,
  errorHandler,
};
