import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

// Register
export const register = async (req, res) => {
    const { name, username, email, password, role, brand_name, industry, phone, city } = req.body;

    try {
        // Check if user exists (this check is now redundant due to unique index, but kept for clarity)
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user object based on role
        const userData = {
            name,
            email,
            password,
            role,
            phone,
            city
        };

        // Add role-specific fields
        if (role === 'brand') {
            userData.brand_name = brand_name;
            userData.industry = industry;
        } else if (role === 'influencer') {
            userData.username = username;
        }

        // Create user
        const user = await User.create(userData);

        if (user) {
            // Generate token
            const token = generateToken(user._id, user.role);
            
            res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                brand_name: user.brand_name, // Include brand_name for brands
                token: token
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                msg: err.message,
                param: err.path,
                location: 'body'
            }));
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const message = field === 'email' 
                ? 'User with this email already exists' 
                : `User with this ${field} already exists`;
            return res.status(400).json({ message });
        }
        res.status(500).json({ message: error.message });
    }
};

// Login
export const login = async (req, res) => {
    const { email, password, userType } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        console.log("=== LOGIN DEBUG INFO ===");
        console.log("Found user role:", user.role);
        console.log("Requested user type:", userType);
        console.log("Found user object:", JSON.stringify(user, null, 2));
        console.log("========================");
        
        // If userType is provided, validate it matches the user's actual role
        if (userType) {
            const normalizedUserType = userType.toString().trim().toLowerCase();
            const normalizedUserRole = user.role.toString().trim().toLowerCase();
            
            if (normalizedUserType === 'brand' && normalizedUserRole !== 'brand') {
                return res.status(400).json({ message: 'Brand account not found. Please check your credentials or select "Influencer" user type.' });
            } else if (normalizedUserType === 'influencer' && normalizedUserRole !== 'influencer') {
                return res.status(400).json({ message: 'Influencer account not found. Please check your credentials or select "Brand" user type.' });
            }
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            brand_name: user.brand_name, // Include brand_name for brands
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Profile
export const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        console.log("=== PROFILE DEBUG INFO ===");
        console.log("Request user role:", req.user.role);
        console.log("Request user object:", JSON.stringify(req.user, null, 2));
        console.log("=========================");

        // Generate a new token to refresh it
        const token = generateToken(req.user._id, req.user.role);

        res.json({
            _id: req.user._id,
            name: req.user.name,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            brand_name: req.user.brand_name, // Include brand_name for brands
            token: token
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Server error while fetching profile" });
    }
};

// Update Password
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Get user from req.user (set by auth middleware)
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if current password is correct
        if (!(await user.matchPassword(currentPassword))) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        // Validate new password
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters long' });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Account
export const deleteAccount = async (req, res) => {
    try {
        // Get user from req.user (set by auth middleware)
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Delete user
        await user.deleteOne();
        
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
