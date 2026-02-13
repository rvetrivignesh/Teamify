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


// Send an invitation to a user
router.post("/invite", protect, async (req, res) => {
    const { userId, projectId, message } = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        // Only owner can invite
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only project owner can invite users" });
        }

        if (project.collaborators.includes(userId)) {
            return res.status(400).json({ message: "User is already a collaborator" });
        }

        const existingRequest = await CollaborationRequest.findOne({
            sender: req.user._id,
            receiver: userId,
            project: projectId,
            status: "pending",
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Invitation already pending" });
        }

        const request = new CollaborationRequest({
            sender: req.user._id,
            receiver: userId,
            project: projectId,
            message,
            type: "invitation",
        });

        await request.save();

        // Notify user
        await Notification.create({
            recipient: userId,
            message: `You have been invited to join "${project.name}"`,
            type: "request",
            relatedId: request._id,
        });

        res.status(201).json({ message: "Invitation sent successfully" });
    } catch (error) {
        console.error(error);
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
            .populate("project")
            .populate("receiver", "username");

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.receiver._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "Request already processed" });
        }

        request.status = status;
        await request.save();

        const senderId = request.sender;
        const receiverId = request.receiver._id;
        const project = await Project.findById(request.project._id);

        if (status === "accepted") {
            const userToAdd = (request.type === "invitation") ? receiverId : senderId;

            // Add collaborator to project
            if (!project.collaborators.includes(userToAdd)) {
                project.collaborators.push(userToAdd);
                await project.save();
            }

            const successMsg = (request.type === "invitation")
                ? `User ${request.receiver.username} accepted your invitation to join "${project.name}"`
                : `Your request to join "${project.name}" has been accepted!`;

            // Notify sender
            await Notification.create({
                recipient: senderId,
                message: successMsg,
                type: "response",
                relatedId: project._id,
            });
        } else {
            const rejectMsg = (request.type === "invitation")
                ? `User ${request.receiver.username} rejected your invitation to join "${project.name}"`
                : `Your request to join "${project.name}" has been rejected.`;

            // Notify sender
            await Notification.create({
                recipient: senderId,
                message: rejectMsg,
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
