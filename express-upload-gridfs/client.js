//@ts-check
const mongodb = require("mongodb");
const { config } = require("./config");

const client = new mongodb.MongoClient(config.mongodbURI);

module.exports = {
  client,
};
