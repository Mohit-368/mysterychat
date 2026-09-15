import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

function setAuthCookie(res, token) {
  res.cookie("token", token, cookieOptions);
}

function publicUser(user) {
  return { id: user._id, username: user.username, email: user.email };
}

function issueToken(user) {
  return jwt.sign(
    { id: user._id.toString(), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

async function registerController(req, res) {
  try {
    const username = String(req.body.username || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!username || !email || !password) return res.status(400).json({ message: "Username, email and password are required" });
    if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) return res.status(400).json({ message: "Username must be 3-24 characters using letters, numbers or underscores" });
    if (password.length < 8 || password.length > 72) return res.status(400).json({ message: "Password must be 8-72 characters" });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ message: exists.email === email ? "Email already exists" : "Username already exists" });

    const user = await User.create({ username, email, password: await bcrypt.hash(password, 12) });
    setAuthCookie(res, issueToken(user));
    return res.status(201).json({ message: "User registered successfully", user: publicUser(user) });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) return res.status(409).json({ message: "Email or username already exists" });
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function loginController(req, res) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password" });

    setAuthCookie(res, issueToken(user));
    return res.json({ message: "User logged in successfully", user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

function logoutController(req, res) {
  res.clearCookie("token", cookieOptions);
  return res.json({ message: "User logged out successfully" });
}

function meController(req, res) {
  return res.json({ user: publicUser(req.user) });
}

export default { registerController, loginController, logoutController, meController };
