import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
    const { name, username, email, password, role } = req.body; // ✅ added username
    try {
        console.log("Register payload:", req.body); // ✅ debug
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, username, email, password, role }); // ✅ pass username

        res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username, // ✅ return username
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        console.error("Registration error:", error); // ✅ debug
        res.status(500).json({ message: error.message });
    }
};
