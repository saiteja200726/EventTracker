const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
});

module.exports = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});
