import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Register
export const register = async (req, res) => {
    const { name, username, email, password, role } = req.body;

    try {
        if (!name || !username || !email || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            role
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide both email and password." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
};

// Get Profile
export const getProfile = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Not authorized." });
    }

    res.status(200).json({
        success: true,
        user: {
            _id: req.user._id,
            name: req.user.name,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    });
};
