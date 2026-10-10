const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");
const User = require("../models/User");
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Please provide name, email and password" });
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return res.status(400).json({ message: "Please enter a valid email" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findByEmail(normalizedEmail)) return res.status(400).json({ message: "User with this email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ userId: randomUUID(), name, email: normalizedEmail, password: hashedPassword, role: role === "faculty" ? "faculty" : "student" });
    res.status(201).json({ message: "User registered successfully", userId: user.userId, name: user.name, email: user.email, role: user.role, token: generateToken(user.userId) });
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") return res.status(409).json({ message: "Could not create user; try registering again" });
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Please provide email and password" });
    const user = await User.findByEmail(email.trim().toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password" });
    res.status(200).json({ message: "Login successful", userId: user.userId, name: user.name, email: user.email, role: user.role, token: generateToken(user.userId) });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
module.exports = { registerUser, loginUser };
