const User = require('../models/users');
const jwt = require('jsonwebtoken');
const {your_secret_key} = require('../config');
const getUserFromToken = async (token) => {
    try {
        const decoded = jwt.verify(token, your_secret_key);
        const userEmail = decoded.email;

        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        // Handle errors
        if (error.name === 'JsonWebTokenError') {
            // Invalid token
            throw new Error('Invalid token');
        } else if (error.name === 'TokenExpiredError') {
            // Token expired
            throw new Error('Token expired');
        } else {
            // Other errors
            throw new Error('Internal server error');
        }
    }
};

module.exports = { getUserFromToken };
