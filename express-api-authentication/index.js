require("dotenv").config();
const mongoose = require("mongoose");
const redis = require("redis");

const app = require("./src/app");
const config = require("./src/config");

async function bootstrap() {
  await mongoose.connect(config.MONGO_CONN_STR);
  console.log("mongodb connected");

  const client = redis.createClient({
    url: config.REDIS_CONN_STR,
  });
  await client.connect();
  console.log("redis connected");
  await client.disconnect();

  app.listen(config.PORT, () => {
    console.log(`server started on http://localhost:${config.PORT}`);
  });
}

bootstrap().catch(console.error);
