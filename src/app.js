const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const rbacRoutes = require("./routes/rbac.routes");
const policyRoutes = require("./routes/policy.routes");
const orgRoutes = require("./routes/org.routes");
const userRoutes = require("./routes/user.routes");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server running",
  });
});

app.post("/debug", (req, res) => {
  console.log("BODY:", req.body);

  res.json({
    success: true,
    body: req.body,
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/rbac", rbacRoutes);
app.use("/api/v1/rbac", policyRoutes);
app.use("/api/v1", orgRoutes);
app.use("/api/v1", userRoutes);

app.use(errorMiddleware);

module.exports = app;