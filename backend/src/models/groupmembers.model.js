import mongoose from "mongoose";

const groupMembersSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: [true, "Group ID is required"]
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"]
    },

    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member"
    },

    joinedAt: {
      type: Date,
      default: Date.now
    }
  }
);

// One user can have only one membership in a particular group
groupMembersSchema.index(
  {
    groupId: 1,
    userId: 1
  },
  {
    unique: true
  }
);

const GroupMembers = mongoose.model(
  "GroupMembers",
  groupMembersSchema
);

export default GroupMembers;