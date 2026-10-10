const Event = require("../models/Event");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const deleteImage = (filename) => { if (!filename) return; const filePath = path.join(__dirname, "../uploads", filename); if (fs.existsSync(filePath)) fs.unlinkSync(filePath); };
async function populateCreator(event) {
  const user = await User.findById(event.createdBy);
  const copy = { ...event };
  copy.createdBy = user ? { userId: user.userId, _id: user.userId, name: user.name, email: user.email } : event.createdBy;
  return copy;
}
const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    const populated = await Promise.all(events.map(populateCreator));
    res.status(200).json(populated);
  } catch (error) { console.error("Get events error:", error); res.status(500).json({ message: "Failed to fetch events" }); }
};
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(await populateCreator(event));
  } catch (error) { console.error("Get event error:", error); res.status(500).json({ message: "Failed to fetch event" }); }
};
const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category, organizer } = req.body;
    if (!title || !description || !date) { if (req.file) deleteImage(req.file.filename); return res.status(400).json({ message: "Title, description and date are required" }); }
    const now = new Date().toISOString();
    const event = { eventId: randomUUID(), title: title.trim(), description: description.trim(), date, time: time || "", location: location || "", category: category || "Other", organizer: organizer || "", image: req.file ? req.file.filename : null, createdBy: req.user._id, registeredUsers: [], createdAt: now, updatedAt: now };
    await Event.create(event);
    res.status(201).json(await populateCreator(event));
  } catch (error) { if (req.file) deleteImage(req.file.filename); console.error("Create event error:", error); res.status(500).json({ message: "Failed to create event" }); }
};
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) { if (req.file) deleteImage(req.file.filename); return res.status(404).json({ message: "Event not found" }); }
    if (event.createdBy !== req.user._id) { if (req.file) deleteImage(req.file.filename); return res.status(403).json({ message: "Not authorized to edit this event" }); }
    const { title, description, date, time, location, category, organizer } = req.body;
    if (req.file && event.image) deleteImage(event.image);
    const fields = { title: title || event.title, description: description || event.description, date: date || event.date, time: time !== undefined ? time : event.time, location: location !== undefined ? location : event.location, category: category || event.category, organizer: organizer !== undefined ? organizer : event.organizer };
    if (req.file) fields.image = req.file.filename;
    const updated = await Event.update(event.eventId, fields);
    res.status(200).json(await populateCreator(updated));
  } catch (error) { if (req.file) deleteImage(req.file.filename); console.error("Update event error:", error); res.status(500).json({ message: "Failed to update event" }); }
};
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.createdBy !== req.user._id) return res.status(403).json({ message: "Not authorized to delete this event" });
    if (event.image) deleteImage(event.image);
    await Event.remove(event.eventId);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) { console.error("Delete event error:", error); res.status(500).json({ message: "Failed to delete event" }); }
};
module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
