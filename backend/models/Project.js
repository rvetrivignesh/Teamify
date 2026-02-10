import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Doing", "Review", "Done"],
        default: "Pending",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
});

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        domain: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        repositoryLink: {
            type: String,
            trim: true,
        },
        skillsRequired: {
            type: [String],
            default: [],
        },
        tasks: {
            type: [taskSchema],
            default: [],
        },
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;
