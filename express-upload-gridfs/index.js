//@ts-check
const express = require("express");
const morgan = require("morgan");
const upload = require("./multer");
const uuid = require("uuid").v4;
const path = require("path");
const fs = require("fs");
const { client } = require("./client");
const { getFile, storeFile } = require("./gfs");
const { nextTick } = require("process");

const app = express();

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  return res.render("index");
});

app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  getFile(filename).pipe(res);
});

app.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("file not found");
    }

    const id = uuid();
    const extension = path.extname(req.file.originalname);
    const newFileName = id + extension;

    const stream = fs.ReadStream.from(req.file.buffer);

    await storeFile(stream, newFileName);

    const fileUrl = "http://localhost:8080/uploads/" + newFileName;

    return res.render("index", { fileUrl });
  } catch (err) {
    next(err);
  }
});

async function main() {
  await client.connect();
  app.listen(8080, () => {
    console.log(`server started on http://localhost:8080`);
  });
}
main().catch((err) => {
  console.log(err);
  process.exit(1);
});
