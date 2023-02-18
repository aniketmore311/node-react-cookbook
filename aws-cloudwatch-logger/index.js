const { Logger } = require("./Logger");
const os = require("os");

//@ts-check
require("dotenv").config();

async function main() {
  const appName = "logger-test-app";
  const hostname = os.hostname();
  const logger = new Logger(appName, hostname);
  await logger.log("test again 1");
  await logger.log("test again 2");
  await Promise.all([
    logger.log("test again 3"),
    logger.log("test again 4"),
    logger.log("test again 5"),
  ]);
}
main().catch((err) => {
  console.log(err);
  process.exit(2);
});
