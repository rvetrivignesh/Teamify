import mongoose from "mongoose";

const collaborationRequestSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
        type: {
            type: String,
            enum: ["join_request", "invitation"],
            default: "join_request",
        },
        message: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("CollaborationRequest", collaborationRequestSchema);
