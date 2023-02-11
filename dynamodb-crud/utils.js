//@ts-check
/**
 * @param {string} key
 * @returns string
 */
function getEnv(key) {
  const val = process.env[key];
  if (!val) {
    throw new Error(`variable ${key} not found`);
  }
  return val;
}

module.exports = {
  getEnv,
};
