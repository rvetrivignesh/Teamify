import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    achievements: {
      type: [String],
      default: [],
    },

    collaborations: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    avatar: {
      type: String, // URL
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("UserProfile", userProfileSchema);
