import Group from "../models/groups.model.js";
import GroupMembers from "../models/groupmembers.model.js";

export default function roomSocket(io, socket) {

  socket.on("join-room", async (roomId) => {
    try {

      if (!roomId) {
        socket.emit("room-error", {
          message: "Room ID is required"
        });

        return;
      }

      /*
       * IMPORTANT:
       * socket.user must be populated by your
       * Socket.IO authentication middleware.
       */

      if (!socket.user) {
        socket.emit("room-error", {
          message: "Authentication required"
        });

        return;
      }

      const userId = socket.user.id;

      // Check if group exists
      const group = await Group.findById(roomId);

      if (!group) {
        socket.emit("room-error", {
          message: "Group not found"
        });

        return;
      }

      // Check whether user belongs to this group
      const membership = await GroupMembers.findOne({
        groupId: roomId,
        userId: userId
      });

      if (!membership) {
        socket.emit("room-error", {
          message: "You are not a member of this group"
        });

        return;
      }

      /*
       * User is authorized.
       *
       * Leave old room first.
       */
      if (socket.currentRoom) {

        socket.leave(socket.currentRoom);

        console.log(
          `${socket.id} left room ${socket.currentRoom}`
        );
      }

      // Join new room
      socket.join(roomId);

      // Remember current room
      socket.currentRoom = roomId;

      console.log(
        `${socket.id} joined room ${roomId}`
      );

      // Tell frontend that joining succeeded
      socket.emit("room-joined", {
        roomId,
        group: {
          id: group._id,
          name: group.name,
          description: group.description
        }
      });

    } catch (error) {

      console.error("Join room error:", error);

      socket.emit("room-error", {
        message: "Unable to join room"
      });
    }
  });


  socket.on("leave-room", () => {

    if (!socket.currentRoom) {
      return;
    }

    const roomId = socket.currentRoom;

    socket.leave(roomId);

    socket.currentRoom = null;

    console.log(
      `${socket.id} left room ${roomId}`
    );

    socket.emit("room-left", {
      roomId
    });
  });
}