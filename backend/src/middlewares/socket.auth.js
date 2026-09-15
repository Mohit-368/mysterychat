import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

function parseCookies(header = "") {
  return Object.fromEntries(
    header.split(";").filter(Boolean).map((part) => {
      const index = part.indexOf("=");
      const key = index >= 0 ? part.slice(0, index).trim() : part.trim();
      const value = index >= 0 ? part.slice(index + 1).trim() : "";
      return [key, decodeURIComponent(value)];
    })
  );
}

export default async function authenticateSocket(socket, next) {
  try {
    const token = parseCookies(socket.handshake.headers.cookie).token;
    if (!token) return next(new Error("User not authenticated"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id username email");
    if (!user) return next(new Error("User not authenticated"));

    socket.user = user;
    next();
  } catch {
    next(new Error("User not authenticated"));
  }
}
