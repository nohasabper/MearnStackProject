const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password'); 

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user;
        const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        console.log("New Token generated without expiration:", newToken);

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
};

module.exports = authMiddleware;
