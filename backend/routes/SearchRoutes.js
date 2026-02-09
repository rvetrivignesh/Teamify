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

        const [projects, users, domains] = await Promise.all([
            Project.find({
                $or: [{ name: regex }, { description: regex }, { skillsRequired: regex }, { domain: regex }],
            }).populate("owner", "username"),
            User.find({
                $or: [{ username: regex }, { email: regex }],
            }).select("-password"),
            Project.distinct("domain", { domain: regex })
        ]);

        return res.json({ projects, users, domains });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
