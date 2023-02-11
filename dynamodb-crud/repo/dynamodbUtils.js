//@ts-check
const { ddbClient } = require("../setup/dynamodbClient");
const { ListTablesCommand } = require("@aws-sdk/client-dynamodb");

async function listTables() {
  const resp = await ddbClient.send(new ListTablesCommand({}));
  if (!resp.TableNames) {
    throw new Error("tablesnames not found");
  }
  return resp.TableNames;
}

module.exports = {
  listTables,
};
