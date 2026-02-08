import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending",
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

export default mongoose.model("Project", projectSchema);
