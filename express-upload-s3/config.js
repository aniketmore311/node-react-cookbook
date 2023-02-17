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
  aws: {
    region: "ap-south-1",
    s3: {
      bucket: "aniket-more-test-1",
    },
  },
};

module.exports = {
  config,
};
