const User = require('../models/users');
const jwt = require('jsonwebtoken');
const {your_secret_key} = require('../config');
const getUserFromToken = async (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies.token) {
            return res.status(401).json({ error: 'Unauthorized: Missing token' });
        }
        const token = req.cookies.token;
        const decoded = jwt.verify(token, your_secret_key);
        const userEmail = decoded.email;

        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new Error('User not found');
        }
        req.user = user;
        next();
    } catch (error) {
        // Handle errors
        if (error.name === 'JsonWebTokenError') {
            // Invalid token
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            // Token expired
            return res.status(401).json({ error: 'Unauthorized: Token expired' });
        } else {
            // Other errors
            console.error("An error occurred:", error.toString());
            return res.status(500).json(error.toString());
        }
    }
};


module.exports = { getUserFromToken };
