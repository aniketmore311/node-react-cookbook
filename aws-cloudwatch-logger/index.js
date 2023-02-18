const { Logger } = require("./Logger");

//@ts-check
require("dotenv").config();

async function main() {
  const logger = new Logger("test-lg-1", "test-ls-1");
  await logger.log("test again 1")
  await logger.log("test again 2")
  await Promise.all([logger.log("test again 3"),logger.log("test again 4"),logger.log("test again 5")])
}
main().catch((err) => {
  console.log(err);
  process.exit(2);
});
