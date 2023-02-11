//@ts-check
const { listTables } = require("./repo/dynamodbUtils");
const { createUserTable } = require("./scripts/createUserTable");
const { dropUserTable } = require("./scripts/dropUserTable");

async function main() {
  //   const resp = await createUserTable();
  //   const resp = await listTables();
  const resp = await dropUserTable();
  console.log(resp);
}
main().catch((err) => {
  console.log(err);
  process.exit(1);
});
