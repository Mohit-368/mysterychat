import Message from "../models/messages.model.js";
import GroupMembers from "../models/groupmembers.model.js";

export default function messageSocket(io, socket) {
  socket.on("send-message", async ({ content } = {}) => {
    try {
      if (!socket.currentRoom) return socket.emit("message-error", { message: "Join a room first" });
      const clean = String(content || "").trim();
      if (!clean) return socket.emit("message-error", { message: "Message cannot be empty" });
      if (clean.length > 2000) return socket.emit("message-error", { message: "Message is too long" });

      const membership = await GroupMembers.findOne({ groupId: socket.currentRoom, userId: socket.user._id });
      if (!membership) return socket.emit("message-error", { message: "You are not a member of this room" });

      const message = await Message.create({ groupId: socket.currentRoom, senderId: socket.user._id, content: clean });
      io.to(socket.currentRoom).emit("new-message", {
        id: message._id,
        groupId: message.groupId,
        senderId: message.senderId,
        senderUsername: socket.user.username,
        content: message.content,
        createdAt: message.createdAt,
      });
    } catch (error) {
      console.error("Send message error:", error);
      socket.emit("message-error", { message: "Unable to send message" });
    }
  });
}
