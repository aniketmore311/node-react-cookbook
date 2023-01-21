//@ts-check
const express = require("express");
const cookieparser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

const user = {
  username: "aniket",
  password: "password",
};

app.use((req, res, next) => {
  console.log("in middleware");
  console.log(req.headers.cookie);
  console.log(req.cookies);
  next();
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("bad_request");
    return;
  }
  if (username == user.username && password == user.password) {
    res
      .cookie("auth_token", "abcd", {
        httpOnly: true,
        secure: false,
      })
      .send("login successful");
    return;
  } else {
    res.status(403).send("forbidden");
    return;
  }
});

app.get("/profile", (req, res) => {
  res.send(JSON.stringify(user));
});

app.listen(8080, () => {
  console.log("server started on port 8080");
});
