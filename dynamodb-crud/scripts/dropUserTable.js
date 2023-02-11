//@ts-check
const { ddbClient } = require("../setup/dynamodbClient");
const { DeleteTableCommand } = require("@aws-sdk/client-dynamodb");
const { config } = require("../config");

async function dropUserTable() {
  const prefix = config.app.NODE_ENV == "development" ? "dev" : "prod";
  const tableName = prefix + "-" + "users";
  const command = new DeleteTableCommand({
    TableName: tableName,
  });
  const resp = await ddbClient.send(command);
  return resp;
}

module.exports = {
  dropUserTable,
};
