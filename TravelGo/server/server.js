const express = require("express");
const cors = require("cors");
const app = express();
const path = require('path');
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5001;

// This allows us to use variables like process.env.PORT or process.env.MONGODB_URI
require("dotenv").config();

// MIDDLEWARE
app.use(express.json());
// WHat is CORS? = (Cross-Origin Resource Sharing) for all routes
app.use(cors());
// Function invocation of the defined constant in line 5
connectDB();

// Routes
/** EXPLANATION
 * Basically, we redirect user paths (abstraction) 
 * to specific backend routes.
 */
app.use("/itineraries", require("./routes/itineraries"));
app.use("/protected", require("./routes/protected"));
// app.use("/weather", require("./routes/weather"));
app.use("/weather-history", require("./routes/weather-openmeteo-history"));
app.use("/weather-forecast", require("./routes/weather-openmeteo-forecast"));
app.use("/users", require("./routes/auth"));
app.use("/collaboration", require("./routes/collaboration"));
app.use("/maps", require("./routes/maps"));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// All other GET requests (INVALID) not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  console.log(`GET request to ${req.url} served by index.html`);
});

// Finally, start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));