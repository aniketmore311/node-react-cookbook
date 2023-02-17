//@ts-check
const express = require("express");
const morgan = require("morgan");
const upload = require("./multer");
const uuid = require("uuid").v4;
const path = require("path");
const fs = require("fs");
const { putFile, getFile } = require("./s3.service");

const app = express();

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  return res.render("index");
});

app.get("/uploads/:filename", async (req, res, next) => {
  try {
    const filename = req.params.filename;
    const stream = await getFile(filename);
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
});

app.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("file not found");
    }

    const id = uuid();
    const extension = path.extname(req.file.originalname);
    const newFileName = id + extension;

    console.log(req.file);

    await putFile(req.file.buffer, newFileName);

    const fileUrl = "http://localhost:8080/uploads/" + newFileName;

    return res.render("index", { fileUrl });
  } catch (err) {
    next(err);
  }
});

async function main() {
  app.listen(8080, () => {
    console.log(`server started on http://localhost:8080`);
  });
}
main().catch((err) => {
  console.log(err);
  process.exit(1);
});
