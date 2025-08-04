const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users"); // Ensure this model exists
const router = express.Router();
const passport = require("passport");

const admin = require("../config/firebaseAdmin");

// 🔹 Verify Firebase Token & Check User
router.post("/check-user", async (req, res) => {
    try {
        console.log('🔍 Backend: Received check-user request');
        const { token } = req.body;

        if (!token) {
            console.log('❌ Backend: No token provided');
            return res.status(400).json({ success: false, error: "No token provided" });
        }

        console.log('🔍 Backend: Token received, length:', token.length);
        console.log('🔍 Backend: Attempting to verify token with Firebase Admin...');

        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log('✅ Backend: Token verified successfully:', {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name
        });

        // First try to find user by Firebase UID
        let user = await User.findOne({ firebaseUID: decodedToken.uid });
        console.log('🔍 Backend: User lookup by firebaseUID result:', user ? 'Found' : 'Not found');

        // If not found by Firebase UID, try to find by email (for existing users)
        if (!user) {
            user = await User.findOne({ email: decodedToken.email });
            console.log('🔍 Backend: User lookup by email result:', user ? 'Found' : 'Not found');

            if (user) {
                // Update existing user with Firebase UID
                console.log('🔍 Backend: Updating existing user with Firebase UID...');
                user.firebaseUID = decodedToken.uid;
                user.name = decodedToken.name || user.name || "No Name";
                await user.save();
                console.log('✅ Backend: Existing user updated with Firebase UID:', user);
            } else {
                // Create new user
                console.log('🔍 Backend: Creating new user...');
                try {
                    user = new User({
                        firebaseUID: decodedToken.uid,
                        name: decodedToken.name || "No Name",
                        email: decodedToken.email,
                        username: decodedToken.email.split('@')[0], // Generate username from email
                        // password is not required for Google OAuth users
                    });
                    await user.save();
                    console.log('✅ Backend: New user created:', user);
                } catch (saveError) {
                    if (saveError.code === 11000) {
                        // Duplicate key error - user was created between our checks
                        console.log('🔍 Backend: Duplicate key error, trying to find user again...');
                        user = await User.findOne({ email: decodedToken.email });
                        if (user) {
                            user.firebaseUID = decodedToken.uid;
                            user.name = decodedToken.name || user.name || "No Name";
                            await user.save();
                            console.log('✅ Backend: Found and updated user after duplicate error:', user);
                        } else {
                            throw saveError;
                        }
                    } else {
                        throw saveError;
                    }
                }
            }
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('❌ Backend: Error in check-user:', error);
        console.error('❌ Backend: Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        res.status(401).json({ success: false, error: "Unauthorized", details: error.message });
    }
});

// 🔹 Firebase Logout (Handled on Client Side)
router.post("/logout", (req, res) => {
    res.json({ success: true, message: "Logged out" });
});


// ✅ Register New User
router.post("/register", async (req, res) => {
    try {
        console.log('🔍 Registration request received:', req.body);
        const { username, email, password } = req.body;

        // Validate required fields for regular registration
        if (!username || !email || !password) {
            console.log('❌ Missing required fields:', { username: !!username, email: !!email, password: !!password });
            return res.status(400).json({
                message: "Username, email, and password are required"
            });
        }

        console.log('✅ All required fields provided');

        // Check if user exists by email or username
        let existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email already exists" });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Username already exists" });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user (without firebaseUID, so username/password are required)
        user = new User({
            username,
            email,
            password: hashedPassword
            // firebaseUID is not set, so username/password validation will apply
        });
        await user.save();

        res.status(201).json({ message: "✅ Registration Successful" });
    } catch (error) {
        console.error('❌ Registration error:', error);

        // Handle duplicate key errors
        if (error.code === 11000) {
            if (error.keyPattern && error.keyPattern.email) {
                return res.status(400).json({ message: "Email already exists" });
            }
            if (error.keyPattern && error.keyPattern.username) {
                return res.status(400).json({ message: "Username already exists" });
            }
            return res.status(400).json({ message: "User already exists" });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }

        res.status(500).json({
            message: "❌ Server Error",
            details: error.message
        });
    }
});

// ✅ Login User (supports both email/password and username/password)
router.post("/login", async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // If only password is provided, try to find any user with that password
        if (!email && !username && password) {
            // Find all users and check password against each (not efficient but works for small user base)
            const users = await User.find({});
            for (let user of users) {
                if (user.password) {
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (isMatch) {
                        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                        return res.status(200).json({ message: "✅ Login Successful", token, user });
                    }
                }
            }
            return res.status(400).json({ message: "Invalid password" });
        }

        // Traditional login with email or username
        let user;
        if (email) {
            user = await User.findOne({ email });
        } else if (username) {
            user = await User.findOne({ username });
        } else {
            return res.status(400).json({ message: "Email, username, or password required" });
        }

        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // Generate Token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "✅ Login Successful", token, user });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: "❌ Server Error" });
    }
});
module.exports = router;
