import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 60 },
  description: { type: String, required: true, trim: true, maxlength: 240 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Group = mongoose.model("Group", groupSchema);
export default Group;
