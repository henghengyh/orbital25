const express = require("express");
//const passport = require('passport');
const cors = require("cors");
require("dotenv").config();

// Initialize Express application
const app = express();

//Add ons (For Middleware to enhance security)
// const authenticateToken = require("./middleware/authenticateToken");

// Middleware
/** EXPLANATION
 * Middleware is like a helper that processes requests before
 * they reach your routes or after a response is sent.
 * For example, 'express.json()' helps us parse JSON data
 * from incoming requests, and 'cors()' allows our server
 * to accept requests from different origins (like a web app
 * running on a different domain).
 * 'passport.initialize()' is used for authentication.
 */
app.use(express.json());
app.use(cors());

//require('./config/passport')(passport);
/** EXPLANATION
 * 1. require() loads the module
 * 2. Gets the exported function
 * 3. Immediately invokes it with passport instance
 */
//app.use(passport.initialize()); // Activates Passport middleware

// Database connection
/** EXPLANATION
 * This is where we connect to our MongoDB database.
 * The connection string is stored in an environment variable
 * for security reasons. The 'mongoose' library helps us
 * interact with MongoDB easily.
 */
const connectDB = require("./config/db");
connectDB();

// Routes
/** EXPLANATION
 * Routes are like the paths in your application that handle
 * different requests. For example, when a user wants to
 * create a new itinerary, they send a request to the
 * '/api/itineraries' route.
 */
app.use("/api/users", require("./routes/auth"));
app.use("/api/protected", require("./routes/protected"));
app.use("/api/weather", require("./routes/weather"));
//app.use('/api/itineraries', require('./routes/itineraries'));

// Start the server
/** EXPLANATION
 * This is where we start our server and listen for incoming requests.
 * The server will run on the port specified in the environment variable
 * or default to 5001 if not set.
 */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
