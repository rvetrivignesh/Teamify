import express from "express";
import Notification from "../models/Notification.js";
import protect from "../middleware/Authenticate.js";

const router = express.Router();

// Get all notifications for current user
router.get("/", protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Mark notification as read
router.put("/:id/read", protect, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (notification.recipient.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
