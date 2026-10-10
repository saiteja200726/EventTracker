const db = require("../config/db");
const { GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const TABLE = process.env.EVENTS_TABLE || "Events";

async function findById(eventId) {
  if (!eventId) return null;
  const result = await db.send(new GetCommand({ TableName: TABLE, Key: { eventId } }));
  return result.Item || null;
}
async function findAll() {
  const result = await db.send(new ScanCommand({ TableName: TABLE }));
  return result.Items || [];
}
async function create(item) {
  await db.send(new PutCommand({ TableName: TABLE, Item: item, ConditionExpression: "attribute_not_exists(eventId)" }));
  return item;
}
async function update(eventId, fields) {
  const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
  if (!entries.length) return findById(eventId);
  const names = {}, values = {}, updates = [];
  entries.forEach(([key, value], i) => {
    names[`#n${i}`] = key; values[`:v${i}`] = value; updates.push(`#n${i} = :v${i}`);
  });
  names["#updatedAt"] = "updatedAt"; values[":updatedAt"] = new Date().toISOString(); updates.push("#updatedAt = :updatedAt");
  const result = await db.send(new UpdateCommand({
    TableName: TABLE, Key: { eventId }, UpdateExpression: `SET ${updates.join(", ")}`,
    ConditionExpression: "attribute_exists(eventId)", ExpressionAttributeNames: names,
    ExpressionAttributeValues: values, ReturnValues: "ALL_NEW",
  }));
  return result.Attributes;
}
async function remove(eventId) {
  await db.send(new DeleteCommand({ TableName: TABLE, Key: { eventId }, ConditionExpression: "attribute_exists(eventId)" }));
}
module.exports = { findById, findAll, create, update, remove };
