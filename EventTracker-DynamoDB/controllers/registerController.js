const Event = require("../models/Event");
const db = require("../config/db");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user._id;
    if (!eventId) return res.status(400).json({ message: "eventId is required" });
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    await db.send(new UpdateCommand({
      TableName: process.env.EVENTS_TABLE || "Events",
      Key: { eventId },
      UpdateExpression: "SET registeredUsers = list_append(if_not_exists(registeredUsers, :empty), :user), updatedAt = :now",
      ConditionExpression: "attribute_exists(eventId) AND (attribute_not_exists(registeredUsers) OR NOT contains(registeredUsers, :userId))",
      ExpressionAttributeValues: { ":empty": [], ":user": [userId], ":userId": userId, ":now": new Date().toISOString() },
    }));
    res.status(200).json({ message: "Successfully registered for the event!" });
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") return res.status(400).json({ message: "You are already registered for this event" });
    console.error("Register for event error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};
module.exports = { registerForEvent };
