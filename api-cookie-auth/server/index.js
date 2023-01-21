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
        sameSite: true,
      })
      .send("login successful");
    return;
  } else {
    res.status(403).send("forbidden");
    return;
  }
});

app.get("/profile", (req, res) => {
  //   console.log(req.haders);
  console.log(req.cookies);
  res.send(JSON.stringify(user));
});

app.listen(8080, () => {
  console.log("server started on port 8080");
});
