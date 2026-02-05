import express from 'express';
import UserProfile from '../models/UserProfile.js';
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
            ...(bio && { bio }),
            ...(skills && { skills }),
            ...(achievements && { achievements })
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


export default router;
