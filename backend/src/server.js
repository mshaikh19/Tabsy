const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to TABSY API!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "TABSY backend is running!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TABSY server running on port ${PORT}`);
});
