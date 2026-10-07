const express = require("express");
const router = express.Router();
const { registerForEvent } = require("../controllers/registerController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/register  — any logged-in user
router.post("/", protect, registerForEvent);

module.exports = router;
