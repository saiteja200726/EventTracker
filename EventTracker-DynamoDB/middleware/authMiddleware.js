const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ message: "Not authorized, no token" });
  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    // Keep _id for compatibility with the existing route/controller logic.
    req.user = { ...user, _id: user.userId };
    delete req.user.password;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
const facultyOnly = (req, res, next) => req.user?.role === "faculty" ? next() : res.status(403).json({ message: "Access denied. Faculty only." });
module.exports = { protect, facultyOnly };
