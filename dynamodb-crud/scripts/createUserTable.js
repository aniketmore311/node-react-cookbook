const { ddbClient } = require("../setup/dynamodbClient");
const { CreateTableCommand } = require("@aws-sdk/client-dynamodb");
const { config } = require("../config");
const { listTables } = require("../repo/dynamodbUtils");

async function createUserTable() {
  const prefix = config.app.NODE_ENV == "development" ? "dev" : "prod";
  const tableName = prefix + "-" + "users";
  const tables = await listTables();
  if (!tables.includes(tableName)) {
    console.log("creating table: " + tableName);
    const command = new CreateTableCommand({
      TableName: tableName,
      AttributeDefinitions: [
        {
          AttributeName: "user_id",
          AttributeType: "S",
        },
        {
          AttributeName: "email",
          AttributeType: "S",
        },
        {
          AttributeName: "created_at",
          AttributeType: "N",
        },
        {
          AttributeName: "updated_at",
          AttributeType: "N",
        },
      ],
      KeySchema: [
        {
          AttributeName: "user_id",
          KeyType: "HASH",
        },
        {
          AttributeName: "created_at",
          KeyType: "RANGE",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "email_gsi",
          KeySchema: [
            {
              AttributeName: "email",
              KeyType: "HASH",
            },
            {
              AttributeName: "created_at",
              KeyType: "RANGE",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: "updated_at_lsi",
          KeySchema: [
            {
              AttributeName: "user_id",
              KeyType: "HASH",
            },
            {
              AttributeName: "updated_at",
              KeyType: "RANGE",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    });
    const resp = await ddbClient.send(command);
    return resp;
  } else {
    console.log("table " + tableName + " already exists");
  }
}

module.exports = {
  createUserTable,
};
