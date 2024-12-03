const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new user (Registration)
exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            // role: 'user' // Optional: Explicitly set the role, though default is 'user'
        });

        // Generate JWT token
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined.');
            return res.status(500).json({ message: 'Internal server error.' });
        }

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return user data and token
        res.status(201).json({
            user: {
                userId: newUser.userId,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt
            },
            token
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login request body:', req.body); // Log request body

        // Validate input
        if (!email || !password) {
            console.log('Missing email or password'); // Log missing fields
            return res.status(400).json({ message: 'البريد الإلكتروني وكلمة المرور مطلوبة.' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        console.log('Found user:', user); // Log found user

        if (!user) {
            return res.status(400).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch); // Log password match result

        if (!isMatch) {
            return res.status(400).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
        }

        // Generate JWT token
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined.');
            return res.status(500).json({ message: 'Internal server error.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return user data and token
        res.json({
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            },
            token
        });
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Update a user
// Update User
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'User deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single user by ID
exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const authenticatedUser = req.user;
        if (authenticatedUser.userId !== userId && authenticatedUser.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You do not have access to this user.' });
        }

        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// controllers/userController.js
exports.getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
