import express from "express";
import User from "../models/User.js";
import Project from "../models/Project.js";
import protect from "../middleware/Authenticate.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.json({ projects: [], users: [] });
    }

    try {
        const regex = new RegExp(q, "i"); // Case-insensitive regex

        const [projects, users] = await Promise.all([
            Project.find({
                $or: [{ name: regex }, { description: regex }, { skillsRequired: regex }],
            }).populate("owner", "username"),
            User.find({
                $or: [{ username: regex }, { email: regex }],
            }).select("-password")
        ]);

        return res.json({ projects, users });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
