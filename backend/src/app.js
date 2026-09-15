import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth.routes.js";
import groupRouter from "./routes/group.routes.js";

dotenv.config();

const app = express();

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "mysterychat" }));


app.use(express.json());
app.use(cookieParser());

// Routes
const allowedOrigins = "https://mysterychat-five.vercel.app"
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true,
}));

app.use("/api/auth", authRouter);
app.use("/api/groups", groupRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

export default app;
