const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { errorHandler, AppError } = require("./middleware/error.middleware");

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration supporting credentials for httpOnly refresh cookies
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new AppError("Not allowed by CORS", 403, "CORS_ERROR"));
    },
    credentials: true,
  }),
);

// Body and Cookie parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base health and welcome routes
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Welcome to TABSY API!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "TABSY backend is running!",
    timestamp: new Date().toISOString(),
  });
});

const apiV1Routes = require("./routes");

// Central API v1 router
app.use("/api/v1", apiV1Routes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404, "NOT_FOUND"));
});

// Central error handler
app.use(errorHandler);

module.exports = app;
