const client = require("../setup/redis");
const crypto = require("crypto");
const ms = require("ms");
const config = require("../config");

/**
 * @param {string} userId
 * @param {string} token
 */
async function storeToken(userId, token) {
  await client.connect();
  const tokenhash = sha256(token);
  await client.set(`refreshTokens#${userId}#${tokenhash}`, 1, {
    PX: ms(config.tokens.refreshToken.validityInStr),
  });
  await client.disconnect();
}

/**
 *
 * @param {string} userId
 * @param {string} token
 */
async function isTokenStored(userId, token) {
  await client.connect();
  const tokenhash = sha256(token);
  const key = `refreshTokens#${userId}#${tokenhash}`;
  const resNum = await client.exists(key);
  if (resNum == 0) {
    await client.disconnect();
    return false;
  } else {
    await client.disconnect();
    return true;
  }
}

/**
 *
 * @param {string} str
 */
function sha256(str) {
  const hash = crypto.createHash("sha256").update(str).digest("hex");
  return hash;
}

const refreshTokensService = {
  isTokenStored,
  storeToken,
};

module.exports = refreshTokensService;
