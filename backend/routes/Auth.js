import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = await User.create({ username: username, email, password });
        const token = generateToken(newUser._id);
        res.status(201).json({ 
            "id": newUser._id,
            "username": newUser.username,
            "email": newUser.email,
            "token": token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
          if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
          }
          const user = await User.findOne({ email });
          if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
          }
          const token = generateToken(user._id);
          res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token: token,
          });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
