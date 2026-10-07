const Event = require("../models/Event");

// @route  POST /api/register
// @access Private
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if already registered
    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    event.registeredUsers.push(userId);
    await event.save();

    res.status(200).json({ message: "Successfully registered for the event!" });
  } catch (error) {
    console.error("Register for event error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

module.exports = { registerForEvent };
