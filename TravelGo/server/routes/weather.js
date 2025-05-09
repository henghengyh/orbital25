const express = require('express');
const axios = require('axios');
const router = express.Router();

// Retrieve weather data for a specific city
/** EXPLANATION
 * This route handles fetching weather data for a specific city.
 * When a user sends a GET request to '/:city', we use the OpenWeatherMap API
 * to get the weather data for that city and send it back to the user.
 * 
 * router.get FUNCTION
 * @param {string} path - The path for the route.
 * @param {function} callback - The function to handle the request.
 * 
 * LAMBDA FUNCTION
 * @param {Object} req - The request object containing city data.
 * @param {Object} res - The response object used to send a response.
 * @return {Object} - The response object containing the weather data or error message.
 */
router.get('/:city', async (req, res) => {
    const city = req.params.city;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) { // Pokemon Exception, should look into how to specify
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

module.exports = router;