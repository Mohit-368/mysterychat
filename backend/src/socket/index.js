import { Server } from "socket.io";
import authenticateSocket from "../middlewares/socket.auth.js";
import roomSocket from "./room.socket.js";
import messageSocket from "./message.socket.js";

export function initializeSocket(server) {
  const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173,http://localhost:5174")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    socket.currentRoom = null;
    roomSocket(io, socket);
    messageSocket(io, socket);

    socket.on("disconnect", () => {
      socket.currentRoom = null;
    });
  });

  return io;
}
