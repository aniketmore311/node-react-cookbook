const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { config } = require("../config");

const ddbClient = new DynamoDBClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

module.exports = {
  ddbClient,
};
