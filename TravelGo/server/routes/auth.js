/**
 * @file auth.js
 * @route /users
 * 
 * This file contains the following routes:
 * 1. POST /register - Register a new user
 * 2. POST /login - Login a user
 * 3. GET /getUserInfo - Get user information
 * 4. POST /update-username - Update username
 * 5. POST /request-email-change - Request email change
 * 6. POST /verify-email-change - Verify email change
 * 7. POST /update-password - Update password
 * 8. POST /upload-profile-photo - Upload profile photo
 * 9. POST /delete-profile-photo - Delete profile photo
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateToken = require("../middleware/authenticateToken");
const cloudinary = require('../utilities/cloudinary');
const streamifier = require('streamifier');
const multer = require('multer');
const upload = multer();

const router = express.Router();

// Register a new user
/** EXPLANATION
 * This route handles user registration.
 * When a user sends a POST request to '/register',
 * we check if the user already exists.
 * If not, we create a new user and save it to the database.
 *
 * router.post FUNCTION
 * @param {string} path - The path for the route.
 * @param {function} callback - The function to handle the request.
 *
 * LAMBDA FUNCTION
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object used to send a response.
 * @return {Object} - The response object containing the status and message.
 */
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        /** User.findOne returns a promise that resolves to the first document.
        /* await is used to wait for the promise to resolve.
        /* If the promise resolves to null, it means no user was found.
        */
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "Email already exists" });

        // Check password strength using zxcvbn API embedded in Node.js
        const result = zxcvbn(password);
        if (result.score < 2) {
            return res.status(400).json({ success: false, message: 'Password is too weak', feedback: result.feedback.suggestions });
        }

        const user = new User({ name, email, password });

        // Writes the user to the database
        await user.save();

        res.status(201).json({ success: true, message: `User ${name} registered successfully` });
    } catch (err) {
        // Pokemon Exception
        res.status(500).json({ message: "Server error" });
    }
});

// Login a user
/** EXPLANATION
 * This route handles user login.
 * When a user sends a POST request to '/login',
 * we check if the user exists and if the password matches.
 * If everything is correct, we generate a JWT token for the user.
 *
 * router.post FUNCTION
 * @param {string} path - The path for the route.
 * @param {function} callback - The function to handle the request.
 *
 * LAMBDA FUNCTION
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object used to send a response.
 * @return {Object} - The response object containing the status and message.
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        /* Check if the user exists
         * If the user does not exist, return a 404 status with a message.
         */
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { _id: user._id, email: user.email, },
            process.env.JWT_SECRET,
            { expiresIn: "12h", }
        );
        res.status(200).json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get user information
/** EXPLANATION
 * This route retrieves the user information.
 * When a user sends a GET request to '/getUserInfo',
 * we check if the user is authenticated and return their information.
 *
 * router.get FUNCTION
 * @param {string} path - The path for the route.
 * @param {function} callback - The function to handle the request.
 *
 * LAMBDA FUNCTION
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object used to send a response.
 * @return {Object} - The response object containing the user information and message.
 */
router.get("/getUserInfo", authenticateToken, async (req, res) => {
    const user = req.user;
    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({ user: isUser, message: "User retrieved successfully" });
});


// Update profile
router.post('/update-profile', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const isUser = await User.findOne({ _id: user._id });
        if (req.body.newName) isUser.name = req.body.newName;
        if (req.body.bio) isUser.profileInfo.bio = req.body.bio;
        if (req.body.favouriteDestination) isUser.profileInfo.favouriteDestination = req.body.favouriteDestination;
        if (req.body.gender) isUser.profileInfo.gender = req.body.gender;
        if (req.body.dateOfBirth) isUser.profileInfo.dateOfBirth = req.body.dateOfBirth;
        if (req.body.location) isUser.profileInfo.location = req.body.location;

        await isUser.save();
        res.json({ success: true, updatedUser: isUser });
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const { sendCodeToEmail } = require("../utilities/email-helper");

// Request email change
router.post('/request-email-change', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const isUser = await User.findOne({ _id: user._id });
        const newEmail = req.body.newEmail;
        if (!(newEmail.includes("@") && newEmail.includes("."))) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        const count = await User.countDocuments({ email: newEmail });
        if (count > 0) return res.status(400).json({ message: "Email already exists" });

        const code = Math.random().toString(36).slice(2, 10);
        isUser.emailVerificationCode = code.toString();
        isUser.pendingEmail = newEmail.toString();
        await isUser.save();

        // Send email to new email address to verify ownership
        sendCodeToEmail(newEmail, code);
        res.json({ success: true, message: 'Verification code sent to new email address. Please verify to complete the change.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

//Verify email change
router.post('/verify-email-change', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const isUser = await User.findOne({ _id: user._id });
        const { userCode } = req.body;

        // For safety precaution, check if user has pending email req
        if (!isUser.emailVerificationCode || !isUser.pendingEmail) {
            return res.status(400).json({ success: false, message: 'No pending email change.' });
        }

        if (userCode !== isUser.emailVerificationCode) {
            return res.status(400).json({ success: false, message: 'Invalid verification code.' });
        }

        isUser.email = isUser.pendingEmail;
        isUser.pendingEmail = undefined;
        isUser.emailVerificationCode = undefined;
        await isUser.save();

        res.json({ success: true, message: 'Email updated successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const zxcvbn = require('zxcvbn');

// Update password
router.post('/update-password', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const isUser = await User.findOne({ _id: user._id });
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (currentPassword == null || newPassword == undefined || confirmPassword == undefined) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        } else if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'New passwords do not match' });
        } else if (currentPassword === newPassword) {
            return res.status(400).json({ success: false, message: 'New password cannot be the same as the current password' });
        } else if (!(await bcrypt.compare(currentPassword, isUser.password))) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        // Check password strength using zxcvbn API embedded in Node.js
        const result = zxcvbn(newPassword);
        if (result.score < 2) {
            return res.status(400).json({ success: false, message: 'Password is too weak', feedback: result.feedback.suggestions });
        }

        // Hash the new password
        isUser.password = newPassword;
        await isUser.save();

        res.json({ success: true, message: 'Password updated successfully', updatedUser: isUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Upload profile photo
router.post('/upload-profile-photo', authenticateToken, upload.single('photo'), async (req, res) => {
    try {
        const user = req.user;
        const isUser = await User.findOne({ _id: user._id });
        if (isUser.profilePhotoPublicId) {
            await cloudinary.uploader.destroy(isUser.profilePhotoPublicId);
        }

        const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "profile_photos" },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(buffer).pipe(stream);
            });
        };
        const result = await streamUpload(req.file.buffer);

        isUser.profilePhoto = result.secure_url;
        isUser.profilePhotoPublicId = result.public_id;

        await isUser.save();
        res.json({ success: true, profilePhoto: isUser.profilePhoto });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete profile photo
router.post('/delete-profile-photo', authenticateToken, async (req, res) => {
    // Okay so basically, Multer handles the filenupload and attachs the file to req.file
    try {
        const user = req.user;
        const isUser = await User.findOne({ _id: user._id });

        if (isUser.profilePhotoPublicId) {
            await cloudinary.uploader.destroy(isUser.profilePhotoPublicId);
            isUser.profilePhoto = undefined;
            isUser.profilePhotoPublicId = undefined;
            await isUser.save();
            return res.json({ success: true, message: 'Profile photo deleted successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'No profile photo to delete' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/update-email-signup', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const isUser = await User.findOne({ _id: user._id });
        isUser.emailSignUp = req.body.emailSignUp;

        await isUser.save();
        res.json({ success: true, updatedUser: isUser });
    } catch (error) {
        console.error('Error updating email sign up:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
