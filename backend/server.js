import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

import authRoutes from "./routes/AuthRoutes.js";
import profileRoutes from "./routes/ProfileRoutes.js";
import projectRoutes from "./routes/ProjectRoutes.js";
import collaborationRoutes from "./routes/CollaborationRoutes.js";
import notificationRoutes from "./routes/NotificationRoutes.js";
import searchRoutes from "./routes/SearchRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://rvetrivignesh.github.io",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies and headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

// Handle Preflight Requests Globally
app.options("*", cors(corsOptions));

// Apply CORS Middleware Globally
app.use(cors(corsOptions));

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/collaboration", collaborationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Teamify backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
