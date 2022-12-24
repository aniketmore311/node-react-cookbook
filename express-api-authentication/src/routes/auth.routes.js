//@ts-check
const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const { catchAsync } = require("../utils");
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const config = require("../config");
const refreshTokensService = require("../service/refreshToken.service");

const authRouter = express.Router();

authRouter.post(
  "/signup",
  body("username")
    .notEmpty()
    .withMessage("password can not be empty")
    .isString()
    .withMessage("password must be string"),
  body("password")
    .notEmpty()
    .withMessage("password can not be empty")
    .isString()
    .withMessage("password must be string"),
  validate(),
  catchAsync(async (req, res) => {
    //register user
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);

    const alreadyUser = await User.findOne({
      username: req.body.username,
    });
    if (alreadyUser) {
      throw createHttpError(400, "user already exists");
    }

    await User.create({
      username: req.body.username,
      password: hashedPassword,
    });

    res.json({
      message: "signup successful login to continue",
    });
  })
);

authRouter.post(
  "/login",

  body("username")
    .notEmpty()
    .withMessage("password can not be empty")
    .isString()
    .withMessage("password must be string"),
  body("password")
    .notEmpty()
    .withMessage("password can not be empty")
    .isString()
    .withMessage("password must be string"),
  validate(),
  catchAsync(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
      throw createHttpError(404, "username or password not correct");
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      throw createHttpError(400, "username or password not correct");
    }

    const payload = {
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.tokens.secret, {
      subject: user.id,
      expiresIn: config.tokens.accessToken.validityInStr,
    });

    const refreshToken = jwt.sign(payload, config.tokens.secret, {
      subject: user.id,
      expiresIn: config.tokens.refreshToken.validityInStr,
    });

    await refreshTokensService.storeToken(user.id, refreshToken);

    return res.json({
      accessToken,
      refreshToken,
    });
  })
);

authRouter.post(
  "/refresh",
  body("refreshToken")
    .notEmpty()
    .withMessage("refreshtoken can not be empty")
    .isString()
    .withMessage("refreshtoken must be string"),
  validate(),
  catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;
    try {
      jwt.verify(refreshToken, config.tokens.secret);
    } catch (err) {
      next(createHttpError(401, "invalid token"));
      return;
    }
    const payload = jwt.decode(refreshToken);
    if (!payload) {
      throw new Error("invalid payload");
    }
    const sub = payload["sub"];
    const role = payload["role"];
    if (sub == undefined || typeof sub != "string") {
      throw new Error("invalid sub");
    }
    if (role == undefined || typeof role != "string") {
      throw new Error("invalid role");
    }
    const isTokenStored = await refreshTokensService.isTokenStored(
      sub,
      refreshToken
    );
    console.log(isTokenStored);
    if (!isTokenStored) {
      throw createHttpError(401, "invalid token");
    }

    const newPayload = {
      role: role,
    };

    const accessToken = jwt.sign(newPayload, config.tokens.secret, {
      subject: sub,
      expiresIn: config.tokens.accessToken.validityInStr,
    });

    return res.json({
      accessToken,
    });
  })
);

module.exports = authRouter;
