import express from "express";
import mongoose from "mongoose";
import Group from "../models/groups.model.js";
import GroupMembers from "../models/groupmembers.model.js";
import Message from "../models/messages.model.js";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authenticateUser);

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get("/", async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 }).lean();
    const memberships = await GroupMembers.find({ userId: req.user._id }).select("groupId role").lean();
    const memberMap = new Map(memberships.map((m) => [m.groupId.toString(), m.role]));
    const memberCounts = await GroupMembers.aggregate([{ $group: { _id: "$groupId", count: { $sum: 1 } } }]);
    const countMap = new Map(memberCounts.map((m) => [m._id.toString(), m.count]));

    res.json({ groups: groups.map((g) => ({ ...g, id: g._id, memberCount: countMap.get(g._id.toString()) || 0, role: memberMap.get(g._id.toString()) || null })) });
  } catch (error) {
    console.error("List groups error:", error);
    res.status(500).json({ message: "Unable to load rooms" });
  }
});

router.post("/", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();
    if (!name || name.length > 60 || !description || description.length > 240) return res.status(400).json({ message: "Name and description are required and must be within limits" });

    const group = await Group.create({ name, description, createdBy: req.user._id });
    await GroupMembers.create({ groupId: group._id, userId: req.user._id, role: "admin" });
    res.status(201).json({ group: { ...group.toObject(), id: group._id, memberCount: 1, role: "admin" } });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "A room with that name already exists" });
    console.error("Create group error:", error);
    res.status(500).json({ message: "Unable to create room" });
  }
});

router.post("/:id/join", async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid room id" });
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Room not found" });
    await GroupMembers.updateOne({ groupId: group._id, userId: req.user._id }, { $setOnInsert: { groupId: group._id, userId: req.user._id, role: "member" } }, { upsert: true });
    res.json({ message: "Joined room", group: { ...group.toObject(), id: group._id } });
  } catch (error) {
    console.error("Join group error:", error);
    res.status(500).json({ message: "Unable to join room" });
  }
});

router.post("/:id/leave", async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid room id" });
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Room not found" });
    if (group.createdBy.toString() === req.user._id.toString()) return res.status(400).json({ message: "The room owner cannot leave the room" });
    await GroupMembers.deleteOne({ groupId: group._id, userId: req.user._id });
    res.json({ message: "Left room" });
  } catch (error) {
    console.error("Leave group error:", error);
    res.status(500).json({ message: "Unable to leave room" });
  }
});

router.post("/:id/messages", async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid room id" });
    const content = String(req.body.content || "").trim();
    if (!content) return res.status(400).json({ message: "Message cannot be empty" });
    if (content.length > 2000) return res.status(400).json({ message: "Message is too long" });
    const membership = await GroupMembers.findOne({ groupId: req.params.id, userId: req.user._id });
    if (!membership) return res.status(403).json({ message: "Join this room first" });
    const message = await Message.create({ groupId: req.params.id, senderId: req.user._id, content });
    res.status(201).json({ message: { ...message.toObject(), id: message._id, senderUsername: req.user.username } });
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({ message: "Unable to send message" });
  }
});

router.get("/:id/messages", async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid room id" });
    const membership = await GroupMembers.findOne({ groupId: req.params.id, userId: req.user._id });
    if (!membership) return res.status(403).json({ message: "Join this room first" });
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const messages = await Message.find({ groupId: req.params.id }).sort({ createdAt: -1 }).limit(limit).lean();
    res.json({ messages: messages.reverse().map((m) => ({ ...m, id: m._id })) });
  } catch (error) {
    console.error("Message history error:", error);
    res.status(500).json({ message: "Unable to load messages" });
  }
});

export default router;
