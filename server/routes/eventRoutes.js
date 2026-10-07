const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect, facultyOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// GET /api/events          — public
router.get("/", getEvents);

// GET /api/events/:id      — public
router.get("/:id", getEventById);

// POST /api/events         — faculty only
router.post("/", protect, facultyOnly, upload.single("image"), createEvent);

// PUT /api/events/:id      — faculty only
router.put("/:id", protect, facultyOnly, upload.single("image"), updateEvent);

// DELETE /api/events/:id   — faculty only
router.delete("/:id", protect, facultyOnly, deleteEvent);

module.exports = router;
