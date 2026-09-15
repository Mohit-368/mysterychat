import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: { createdAt: true, updatedAt: false } });
messageSchema.index({ groupId: 1, createdAt: 1 });
const Message = mongoose.model("Message", messageSchema);
export default Message;
