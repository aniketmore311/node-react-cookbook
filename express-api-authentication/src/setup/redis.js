//@ts-check
const { createClient } = require("redis");
const config = require("../config");

const client = createClient({
  url: config.REDIS_CONN_STR,
});

module.exports = client;
