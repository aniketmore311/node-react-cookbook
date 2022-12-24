//@ts-check

const { loadEnvorDefault } = require("./utils");

const config = {
  PORT: loadEnvorDefault("PORT"),
  NODE_ENV: loadEnvorDefault("NODE_ENV", "development"),
  MONGO_CONN_STR: loadEnvorDefault("MONGO_CONN_STR"),
  REDIS_CONN_STR: loadEnvorDefault("REDIS_CONN_STR"),
  tokens: {
    secret: loadEnvorDefault("SECRET"),
    accessToken: {
      validityInStr: "10m",
    },
    refreshToken: {
      validityInStr: "7d",
    },
  },
  expressjwt: {
    options: {
      secret: loadEnvorDefault("SECRET"),
      /**@type {import('jsonwebtoken').Algorithm[]} */
      algorithms: ["HS256"],
      requestProperty: "user",
    },
  },
  guard: {
    options: {
      requestProperty: "user",
      permissionsProperty: "role",
    },
  },
};

module.exports = config;
