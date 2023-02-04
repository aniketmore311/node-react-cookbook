//@ts-check
require("dotenv").config();
const app = require("./app");
const http = require("http");
const { getEnv } = require("./utils");
const { cognitoState } = require("./cognito.setup");
const { Issuer } = require("openid-client");

const awsRegion = getEnv("AWS_REGION");
const cognitoUserPoolId = getEnv("COGNITO_USER_POOL_ID");
const clientId = getEnv("CLIENT_ID");
const clientSecret = getEnv("CLIENT_SECRET");
const redirectUri = getEnv("REDIRECT_URI");

const issuerURL = `https://cognito-idp.${awsRegion}.amazonaws.com/${cognitoUserPoolId}`;

async function main() {
  const server = http.createServer(app);

  cognitoState.issuer = await Issuer.discover(issuerURL);
  if (!cognitoState.issuer) {
    throw new Error("no issuer set");
  }

  const client = new cognitoState.issuer.Client({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [redirectUri],
    response_types: ["code"],
  });

  cognitoState.client = client;

  server.listen(getEnv("PORT"), () => {
    console.log(`server started on http://localhost:${getEnv("PORT")}`);
  });
}

main().catch(console.log);
