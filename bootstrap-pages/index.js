const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

app.use(express.static("./public"));

app.listen(8080, () => {
  console.log(`server started on http://localhost:8080`);
});
