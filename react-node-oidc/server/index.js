//@ts-check
const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios").default;

require("dotenv").config();

function getEnvVar(name) {
  const val = process.env[name];
  if (!val) {
    throw new Error(`variable ${name} not defined !!`);
  }
  return val;
}

const clientID = getEnvVar("GOOGLE_CLIENT_ID");
const clientSecret = getEnvVar("GOOGLE_CLIENT_SECRET");

const cognitoClientId = getEnvVar("COGNITO_CLIENT_ID");
const cognitoClientSecret = getEnvVar("COGNITO_CLIENT_SECRET");

const secret = "some secret 1234";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

//utils
async function getIdToken({
  token_endpoint,
  code,
  client_id,
  client_secret,
  redirect_uri,
}) {
  try {
    const urlParams = new URLSearchParams([
      ["code", code],
      ["grant_type", "authorization_code"],
      ["redirect_uri", redirect_uri],
      ["client_id", client_id],
      ["client_secret", client_secret],
    ]);
    const resp = await axios.post(token_endpoint, urlParams);
    console.log("resp data");
    console.log(resp.data);
    const id_token = resp.data.id_token;
    return id_token;
  } catch (err) {
    throw err;
  }
}

app.post("/auth/cognito/login", async (req, res) => {
  try {
    const id_token = await getIdToken({
      token_endpoint:
        "https://testapp2.auth.ap-south-1.amazoncognito.com/oauth2/token",
      client_id: cognitoClientId,
      client_secret: cognitoClientSecret,
      code: req.body.code,
      redirect_uri: "http://localhost:3000/auth/cognito/cb",
    });
    const data = jwt.decode(id_token);
    if (!data) {
      throw new Error("invalid token");
    }
    const token = jwt.sign(data, secret);
    res.json({
      accessToken: token,
    });
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
    }
  }
});

app.listen(8080, () => {
  console.log("server started");
});
