import express from "express";
import Project from "../models/Project.js";
import CollaborationRequest from "../models/CollaborationRequest.js";
import Notification from "../models/Notification.js";
import UserProfile from "../models/UserProfile.js";
import protect from "../middleware/Authenticate.js";

const router = express.Router();

// Create a new project
router.post("/", protect, async (req, res) => {
    try {
        const { name, description, skillsRequired, tasks, domain, repositoryLink } = req.body;

        const project = new Project({
            name,
            description,
            skillsRequired,
            tasks,
            domain,
            repositoryLink,
            owner: req.user._id,
            collaborators: [],
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Get all unique domains
router.get("/domains", protect, async (req, res) => {
    try {
        const domains = await Project.distinct("domain");
        res.json(domains);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get all projects (Explore) - Supports domain filtering
router.get("/", protect, async (req, res) => {
    try {
        const { domain } = req.query;
        let query = {};

        if (domain) {
            query.domain = domain;
        }

        const projects = await Project.find(query)
            .populate("owner", "username email")
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get recommended projects based on user skills
router.get("/recommended", protect, async (req, res) => {
    try {
        const userProfile = await UserProfile.findOne({ user: req.user._id });
        if (!userProfile || !userProfile.skills || userProfile.skills.length === 0) {
            return res.json([]);
        }

        const projects = await Project.find({
            skillsRequired: { $in: userProfile.skills },
            owner: { $ne: req.user._id }, // Exclude own projects
            collaborators: { $ne: req.user._id }, // Exclude already joined
        }).populate("owner", "username email");

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get my projects (Owned or Collaborating)
router.get("/my-projects", protect, async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [{ owner: req.user._id }, { collaborators: req.user._id }],
        }).populate("owner", "username email");
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get projects by specific user ID
router.get("/user/:userId", protect, async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.params.userId })
            .populate("owner", "username email")
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get single project
router.get("/:id", protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("owner", "username email")
            .populate("collaborators", "username email");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Request to join a project
router.post("/:id/join", protect, async (req, res) => {
    const { message } = req.body;
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "You are the owner of this project" });
        }

        if (project.collaborators.includes(req.user._id)) {
            return res.status(400).json({ message: "You are already a collaborator" });
        }

        const existingRequest = await CollaborationRequest.findOne({
            sender: req.user._id,
            project: project._id,
            status: "pending",
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Request already pending" });
        }

        const request = new CollaborationRequest({
            sender: req.user._id,
            receiver: project.owner,
            project: project._id,
            message,
        });

        await request.save();

        // Create notification for project owner
        await Notification.create({
            recipient: project.owner,
            message: `User ${req.user.username} requested to join your project "${project.name}"`,
            type: "request",
            relatedId: request._id,
        });

        res.status(201).json({ message: "Request sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// Remove collaborator
router.delete("/:id/collaborators/:userId", protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Only owner can remove collaborators
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const collaboratorId = req.params.userId;

        if (!project.collaborators.includes(collaboratorId)) {
            return res.status(400).json({ message: "User is not a collaborator" });
        }

        project.collaborators = project.collaborators.filter(
            (id) => id.toString() !== collaboratorId
        );

        await project.save();

        // Notify the removed collaborator
        await Notification.create({
            recipient: collaboratorId,
            message: `You have been removed from the project "${project.name}" by the owner.`,
            type: "info",
            relatedId: project._id,
        });

        res.json({ message: "Collaborator removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Update project details
router.put("/:id", protect, async (req, res) => {
    try {
        const { name, description, skillsRequired, tasks, domain, repositoryLink } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to update this project" });
        }

        project.name = name || project.name;
        project.description = description || project.description;
        project.skillsRequired = skillsRequired || project.skillsRequired;
        project.tasks = tasks || project.tasks;
        project.domain = domain || project.domain;
        project.repositoryLink = repositoryLink || project.repositoryLink;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Delete a project
router.delete("/:id", protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to delete this project" });
        }

        await project.deleteOne();
        res.json({ message: "Project removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;

