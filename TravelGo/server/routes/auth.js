const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateToken = require("../middleware/authenticateToken");

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
    if (existingEmail)
      return res.status(400).json({ message: "Email already exists" });

    const user = new User({ name, email, password });

    // Writes the user to the database
    await user.save();

    res.status(201).json({ message: `User ${name} registered successfully` });
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

module.exports = router;
