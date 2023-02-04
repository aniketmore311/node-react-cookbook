//@ts-check
const express = require("express");
const { cognitoState } = require("./cognito.setup");
const morgan = require("morgan");
const session = require("express-session");
const { getEnv } = require("./utils");
const SQLiteStore = require("connect-sqlite3")(session);

const secretKey = getEnv("SECRET_KEY");
const clientId = getEnv("CLIENT_ID");
const redirectUri = getEnv("REDIRECT_URI");
const logoutUri = getEnv("LOGOUT_URI");

const app = express();

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
    //@ts-expect-error
    store: new SQLiteStore({
      table: "sessions",
      db: "sessions.db",
    }),
    cookie: {
      httpOnly: true,
      sameSite: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  console.log(req.session);
  //@ts-expect-error
  res.locals.user = req.session.user;
  //@ts-expect-error
  if (!req.session.count) {
    //@ts-expect-error
    req.session.count = 0;
  }
  //@ts-expect-error
  res.locals.count = req.session.count;
  // @ts-expect-error
  req.session.count = req.session.count + 1;
  // console.debug("\n" + "session global middleware");
  // console.debug({ session: req.session });
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/auth/login", (req, res) => {
  const client = cognitoState.client;
  if (!client) {
    throw new Error("invalid cognito client");
  }
  const authorizationUrl = client.authorizationUrl({
    scope: "openid email profile",
  });
  res.redirect(authorizationUrl);
});

app.get("/auth/logout", (req, res) => {
  const issuer = cognitoState.issuer;
  if (!issuer) {
    throw new Error("invalid issuer");
  }
  const authEndpoint = issuer.metadata.authorization_endpoint;
  if (!authEndpoint) {
    throw new Error("auth endpoint not found");
  }

  const urlParams = new URLSearchParams([
    ["logout_uri", logoutUri],
    ["client_id", clientId],
  ]);
  const logoutEndpoint = authEndpoint.split("/oauth2")[0] + "/logout";
  const logoutURL = logoutEndpoint + "?" + urlParams.toString();
  //@ts-expect-error
  req.session.user = undefined;
  res.redirect(logoutURL);
});

app.get("/auth/cognito/cb", async (req, res, next) => {
  try {
    const client = cognitoState.client;
    if (!client) {
      throw new Error("invalid cognito client");
    }
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(redirectUri, params);
    const accessToken = tokenSet.access_token;
    if (!accessToken) {
      throw new Error("access token not found");
    }
    const userInfo = await client.userinfo(accessToken);
    //@ts-expect-error
    req.session.user = userInfo;
    // console.debug("\n" + "session in handler");
    // console.debug({ session: req.session });
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

module.exports = app;
