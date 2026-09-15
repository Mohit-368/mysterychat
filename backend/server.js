import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { initializeSocket } from "./src/socket/index.js";

const PORT = Number(process.env.PORT || 5000);
const server = http.createServer(app);
initializeSocket(server);

try {
  await connectDB();
  server.listen(PORT, () => console.log(`MysteryChat API running on http://localhost:${PORT}`));
} catch (error) {
  console.error("Startup failed:", error);
  process.exit(1);
}
