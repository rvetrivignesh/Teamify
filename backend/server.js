import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/AuthRoutes.js";
import profileRoutes from "./routes/ProfileRoutes.js";
import projectRoutes from "./routes/ProjectRoutes.js";
import collaborationRoutes from "./routes/CollaborationRoutes.js";
import notificationRoutes from "./routes/NotificationRoutes.js";
import searchRoutes from "./routes/SearchRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rvetrivignesh.github.io",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/collaboration", collaborationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the backend server!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
