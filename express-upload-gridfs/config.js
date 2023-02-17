//@ts-check
require("dotenv").config();

/**
 * @param {string} key
 * @returns string
 */
function getEnv(key) {
  const val = process.env[key];
  if (val == undefined || val == null) {
    throw new Error(`env var ${key} not found`);
  }
  return val;
}

const config = {
  mongodbURI: getEnv("MONGODB_URI"),
};

module.exports = {
  config,
};
