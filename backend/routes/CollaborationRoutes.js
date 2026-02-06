import express from "express";
import CollaborationRequest from "../models/CollaborationRequest.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";
import protect from "../middleware/Authenticate.js";

const router = express.Router();


// Get all requests (incoming and outgoing)
router.get("/", protect, async (req, res) => {
    try {
        const sent = await CollaborationRequest.find({ sender: req.user._id })
            .populate("project", "name")
            .populate("receiver", "username");

        const received = await CollaborationRequest.find({ receiver: req.user._id })
            .populate("project", "name")
            .populate("sender", "username");

        res.json({ sent, received });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get single request by ID
router.get("/:id", protect, async (req, res) => {
    try {
        const request = await CollaborationRequest.findById(req.params.id)
            .populate("project", "name")
            .populate("sender", "username email")
            .populate("receiver", "username");

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Allow only sender or receiver to view
        if (request.sender._id.toString() !== req.user._id.toString() &&
            request.receiver._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// Respond to collaboration request (Accept/Reject)
router.put("/:id", protect, async (req, res) => {
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const request = await CollaborationRequest.findById(req.params.id)
            .populate("project");

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.receiver.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "Request already processed" });
        }

        request.status = status;
        await request.save();

        const senderId = request.sender;
        const project = await Project.findById(request.project._id);

        if (status === "accepted") {
            // Add collaborator to project
            if (!project.collaborators.includes(senderId)) {
                project.collaborators.push(senderId);
                await project.save();
            }

            // Notify sender
            await Notification.create({
                recipient: senderId,
                message: `Your request to join "${project.name}" has been accepted!`,
                type: "response",
                relatedId: project._id,
            });
        } else {
            // Notify sender
            await Notification.create({
                recipient: senderId,
                message: `Your request to join "${project.name}" has been rejected.`,
                type: "response",
                relatedId: project._id,
            });
        }

        res.json({ message: `Request ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
