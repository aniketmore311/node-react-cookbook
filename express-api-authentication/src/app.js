//@ts-check
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const authRouter = require("./routes/auth.routes");
const errorHandler = require("./middleware/errorHandler");
const createHttpError = require("http-errors");
const protectedRouter = require("./routes/protected.routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("common"));

app.get("/", (req, res) => {
  return res.json({
    status: "ok",
  });
});

app.get("/healthcheck", (req, res) => {
  return res.json({
    status: "ok",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/protected", protectedRouter);

//error handlers

//eslint-disable-next-line
app.use(function (err, req, res, next) {
  console.log(err);
  next(err);
});

app.use(function (err, req, res, next) {
  if (err.status == 401) {
    next(createHttpError(401, "invalid access token"));
  } else if (err.status == 403) {
    next(createHttpError(403, "access denied"));
  } else {
    next(err);
  }
});

app.use(errorHandler());

module.exports = app;
