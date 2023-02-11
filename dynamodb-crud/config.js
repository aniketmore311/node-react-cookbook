//@ts-check
require("dotenv").config();
const { getEnv } = require("./utils");

const config = {
  aws: {
    region: getEnv("AWS_DEFAULT_REGION"),
    accessKeyId: getEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY"),
  },
  app: {
    NODE_ENV: getEnv("NODE_ENV"),
  },
};

module.exports = {
  config,
};
