//@ts-check
const cognitoState = {
  /**@type {import("openid-client").BaseClient | undefined} */
  client: undefined,
  /**@type {import("openid-client").Issuer | undefined} */
  issuer: undefined,
};

module.exports = {
  cognitoState,
};
