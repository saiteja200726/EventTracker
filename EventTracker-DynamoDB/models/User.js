const db = require("../config/db");
const { GetCommand, PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const TABLE = process.env.USERS_TABLE || "Users";

async function findById(userId) {
  if (!userId) return null;
  const result = await db.send(new GetCommand({ TableName: TABLE, Key: { userId } }));
  return result.Item || null;
}

async function findByEmail(email) {
  const result = await db.send(new QueryCommand({
    TableName: TABLE,
    IndexName: process.env.USERS_EMAIL_INDEX || "email-index",
    KeyConditionExpression: "#email = :email",
    ExpressionAttributeNames: { "#email": "email" },
    ExpressionAttributeValues: { ":email": email.toLowerCase() },
    Limit: 1,
  }));
  return (result.Items || [])[0] || null;
}

async function create({ userId, name, email, password, role }) {
  const user = {
    userId, name: name.trim(), email: email.trim().toLowerCase(), password, role,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  await db.send(new PutCommand({
    TableName: TABLE, Item: user,
    ConditionExpression: "attribute_not_exists(userId)",
  }));
  return user;
}

module.exports = { findById, findByEmail, create };
