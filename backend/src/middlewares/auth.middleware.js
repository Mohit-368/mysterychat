import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

async function authenticateUser(req, res, next) {
  try {
    // 1. Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user
    // NOTE: the token is signed with an "id" claim (see auth.controller.js),
    // so we must read decoded.id here, not decoded.userId.
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    // 4. Attach user to request
    req.user = user;

    // 5. Continue
    next();
  } catch (error) {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }
}

export default authenticateUser;