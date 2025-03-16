const express = require("express");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const User = require("../models/users");
const {getUserFromToken} = require('../utils/user');
const {your_secret_key} = require('../config')

const router = express.Router();

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { request } = require("http");


const verifyPassword = async (req, res) => {
    const email = req.query.email;
    const password = req.query.password;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            // User not found
            return res.status(401).json(false);
        }

        // Hash the provided password and compare it with the stored hashed password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (hashedPassword === user.password) {
            // Passwords match, generate JWT token
            const token = jwt.sign({ email: user.email }, your_secret_key , { expiresIn: '1h' });
            
            // Set the token in a cookie
            res.cookie('token', token, { httpOnly: true });

            
            
            // Return true indicating successful password verification
            return res.status(200).json(true);
        } else {
            // Passwords do not match
            return res.status(401).json(false);
        }
    } catch (error) {
        // Internal server error
        return res.status(500).json(false);
    }
};

const logout = (req, res) => {
    try {
        // Clear the token cookie by setting an empty token with an expired date
        res.cookie('token', '', { expires: new Date(0), httpOnly: true });
        
        // Respond with status code 200 indicating successful logout
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        // If an error occurs during logout, respond with a status code of 500 and an error message
        console.error("Logout failed:", error);
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
};

// Usage: Call this function when the user logs out

// Usage: Call this function when the user logs out


const addUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Regular expressions for email and password validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/;

        // Validate email format
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // Validate password format
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character. The first character should be an alphabet." });
        }

        // Check if email or username already exists
        const existingUser = await User.findOne({ $or: [{ email: email }, { name: name }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({ success: false, message: "Email already exists" });
            } else {
                return res.status(409).json({ success: false, message: "Username already exists" });
            }
        } else {
            // Hashing the password using SHA-256
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            
            const newUser = new User({ name: name, email: email, password: hashedPassword, type: 0, impressions: 0 });
            await newUser.save();
            return res.status(201).json({ success: true, message: "User added successfully" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};




const loginAsGuest = async (req, res) => {
    const email = "testGuest@gmail.com";
    const password = "1234";
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            // User not found
            return res.status(401).json({ error: 'User not found'});
        }

        // Hash the provided password and compare it with the stored hashed password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (hashedPassword === user.password) {
            // Passwords match, generate JWT token
            const token = jwt.sign({ email: user.email }, your_secret_key, { expiresIn: '1h' });
            
            // Set the token in a cookie
            res.cookie('token', token, { httpOnly: true });
            
            // Return true indicating successful password verification
            return res.status(200).json(true);
        } else {
            // Passwords do not match
            return res.status(401).json({ error: 'password dont match'});
        }
    } catch (error) {
        // Internal server error
        return res.status(500).json({ error: 'internal server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.token) {
            return res.status(401).json({ error: 'Unauthorized: Missing token' });
        }

        const token = req.cookies.token;
        // Check if token is valid
        const user = await getUserFromToken(token);

        // Check old password
        const { oldPassword, newPassword, name, email } = req.body;
        const hashedOldPassword = crypto.createHash('sha256').update(oldPassword).digest('hex');

        if (hashedOldPassword !== user.password) {
            return res.status(400).json({ success: false, message: 'Old password is incorrect' });
        }

        // Check if new email or username is different from the existing one
        if (email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }
        }
        
        if (name !== user.name) {
            const existingUsername = await User.findOne({ name });
            if (existingUsername && existingUsername._id.toString() !== user._id.toString()) {
                return res.status(400).json({ success: false, message: 'Username already exists' });
            }
        }

        // Update profile
        user.name = name;
        user.email = email;

        // Hash and update new password
        const hashedNewPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
        user.password = hashedNewPassword;

        await user.save();

        // Return the updated user profile
        const updatedProfile = {
            _id: user._id,
            email: user.email,
            impressions: user.impressions,
            name: user.name,
            type: user.type
        };

        return res.status(200).json({ success: true, message: 'Profile updated successfully', user: updatedProfile });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message.toString() });
    }
};


const getMyUserDetails = async(req,res)=>{
    try {
        if (!req.cookies || !req.cookies.token) {
            return res.status(401).json({ error: 'Unauthorized: Missing token' });
        }
        const token = req.cookies.token;
        const user = await getUserFromToken(token);

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            type: user.type,
            impressions: user.impressions
            // You can include other user details here if needed
        });
    } catch (error) {
        return res.status(500).json({ error: `Failed to get user details: ${error.message}` });
    }

}


const getUserDetailsByUID = async (req, res) => {
    try {
        const uid = req.params.uid; // Assuming UID is provided in the request parameters

        // Check if UID is provided
        if (!uid) {
            return res.status(400).json({ error: 'UID is required' });
        }
        
        // Retrieve user using the UID
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user details
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            type: user.type,
            impressions: user.impressions
            // You can include other user details here if needed
        });
    } catch (error) {
        return res.status(500).json({ error: `Failed to get user details: ${error.message}` });
    }
};


const getUsersByUsername = async (req, res) => {
    try {
        const usernameFilter = req.query.usernameFilter || ''; // Get the username filter from query parameters, default to empty string if not provided

        // Construct a regular expression for case-insensitive search
        const regex = new RegExp(usernameFilter, 'i');

        // Find users that match the username filter
        const users = await User.find(usernameFilter ? { name: regex } : {});

        // Return array of user details
        const userDetails = users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            type: user.type,
            impressions: user.impressions
            // You can include other user details here if needed
        }));

        // Return the user details
        return res.status(200).json(userDetails);
    } catch (error) {
        return res.status(500).json({ error: `Failed to get users by username filter: ${error.message}` });
    }
};






router.get("/verifyPassword", verifyPassword);
router.post("/addUser", addUser);
router.get("/loginAsGuest", loginAsGuest);
router.post("/updateProfile", updateProfile);
router.get('/myUserDetails', getMyUserDetails); // Route to get details of the currently logged-in user
router.get('/userDetails/:uid', getUserDetailsByUID); // Route to get details of a user by UID
router.get('/usersByUsername', getUsersByUsername); // Route to get users by username search filter
router.get('/logout', logout);


module.exports = router;
