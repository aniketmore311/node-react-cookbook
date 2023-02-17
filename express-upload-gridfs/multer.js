//@ts-check
const multer = require("multer");
const uuid = require("uuid").v4;
const path = require("path");
const config = require("./config");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

module.exports = upload;
