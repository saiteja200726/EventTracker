const Event = require("../models/Event");
const fs = require("fs");
const path = require("path");

// Helper: delete old image file
const deleteImage = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "../uploads", filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// @route  GET /api/events
// @access Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .sort({ date: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// @route  GET /api/events/:id
// @access Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Event not found" });
    }
    console.error("Get event error:", error);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};

// @route  POST /api/events
// @access Private (faculty only)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category, organizer } = req.body;

    if (!title || !description || !date) {
      // Remove uploaded file if validation fails
      if (req.file) deleteImage(req.file.filename);
      return res.status(400).json({ message: "Title, description and date are required" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      organizer,
      image: req.file ? req.file.filename : null,
      createdBy: req.user._id,
    });

    const populated = await event.populate("createdBy", "name email");
    res.status(201).json(populated);
  } catch (error) {
    if (req.file) deleteImage(req.file.filename);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error("Create event error:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
};

// @route  PUT /api/events/:id
// @access Private (faculty only, own event)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      if (req.file) deleteImage(req.file.filename);
      return res.status(404).json({ message: "Event not found" });
    }

    // Only the faculty who created it can edit
    if (event.createdBy.toString() !== req.user._id.toString()) {
      if (req.file) deleteImage(req.file.filename);
      return res.status(403).json({ message: "Not authorized to edit this event" });
    }

    const { title, description, date, time, location, category, organizer } = req.body;

    // If a new image was uploaded, delete the old one
    if (req.file && event.image) {
      deleteImage(event.image);
    }

    event.title       = title       || event.title;
    event.description = description || event.description;
    event.date        = date        || event.date;
    event.time        = time        !== undefined ? time        : event.time;
    event.location    = location    !== undefined ? location    : event.location;
    event.category    = category    || event.category;
    event.organizer   = organizer   !== undefined ? organizer   : event.organizer;
    if (req.file) event.image = req.file.filename;

    const updated = await event.save();
    const populated = await updated.populate("createdBy", "name email");
    res.status(200).json(populated);
  } catch (error) {
    if (req.file) deleteImage(req.file.filename);
    console.error("Update event error:", error);
    res.status(500).json({ message: "Failed to update event" });
  }
};

// @route  DELETE /api/events/:id
// @access Private (faculty only, own event)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only creator can delete
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    // Delete associated image
    if (event.image) deleteImage(event.image);

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
