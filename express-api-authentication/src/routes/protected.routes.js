//@ts-check
const express = require("express");
const { expressjwt } = require("express-jwt");
const config = require("../config");
const guard = require("express-jwt-permissions")(config.guard.options);

const protectedRouter = express.Router();

protectedRouter.get(
  "/user",
  expressjwt(config.expressjwt.options),
  guard.check("USER"),
  (req, res) => {
    res.json({
      //@ts-ignore
      user: req.user,
    });
  }
);

protectedRouter.get(
  "/admin",
  expressjwt(config.expressjwt.options),
  guard.check("ADMIN"),
  (req, res) => {
    res.json({
      //@ts-ignore
      user: req.user,
    });
  }
);

protectedRouter.get("/any", (req, res) => {
  res.json({
    //@ts-ignore
    user: req.user,
  });
});

module.exports = protectedRouter;
