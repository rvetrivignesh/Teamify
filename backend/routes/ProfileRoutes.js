import express from 'express';
import UserProfile from '../models/UserProfile.js';
import User from '../models/User.js';
import protect from '../middleware/Authenticate.js';

const router = express.Router();

router.get('/me', protect, async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ user: req.user._id }).populate(
            'user',
            'username email',
        );

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post("/", protect, async (req, res) => {
    try {

        const { bio, skills, achievements } = req.body;

        const profileFields = {
            user: req.user._id,
            bio,
            skills,
            achievements
        };

        let profile = await UserProfile.findOne({ user: req.user._id });

        if (profile) {
            profile = await UserProfile.findOneAndUpdate(
                { user: req.user._id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        profile = new UserProfile(profileFields);
        await profile.save();

        res.json(profile);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get recommended users based on skill overlap
router.get("/recommendations", protect, async (req, res) => {
    try {
        const userProfile = await UserProfile.findOne({ user: req.user._id });

        if (!userProfile || !userProfile.skills || userProfile.skills.length === 0) {
            return res.json([]);
        }

        const recommendedUsers = await UserProfile.find({
            skills: { $in: userProfile.skills },
            user: { $ne: req.user._id }
        }).populate("user", "username email");

        res.json(recommendedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get user profile by Username
router.get("/u/:username", protect, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profile = await UserProfile.findOne({ user: user._id }).populate(
            "user",
            "username email"
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

export default router;
