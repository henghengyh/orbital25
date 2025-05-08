File: `weather.js` 
===
Created on 2025-05-08

### Initialisation
The `weather.js` file defines the routes for weather data in the TravelGo backend. It fetches weather information from an external weather API (e.g., OpenWeatherMap) and provides endpoints for the frontend to retrieve weather details based on user input, such as city names.

---

### Explanation

#### 1. **Dependencies**
The file imports the following libraries:
- **`express`**: To define routes and handle HTTP requests.
- **`axios`**: To make HTTP requests to the external weather API.

---

#### 2. **Routes**

##### **`GET /api/weather/:city`**
- **Purpose**: Fetches weather information for a specific city.
- **Process**:
  1. Extracts the `city` parameter from the request URL.
  2. Constructs a request to the external weather API (e.g., OpenWeatherMap) using the city name and the API key stored in the environment variable (`WEATHER_API_KEY`).
  3. Sends the request to the weather API and retrieves the weather data.
  4. Returns the weather data as a JSON response to the frontend.
- **Error Handling**:
  - If the city is not found or the API request fails, returns a `500` status with an error message.

---

### 3. **Testing the Endpoints**  

You can use **Postman** to test the `GET /api/weather/:city` endpoint defined in `weather.js`. Below are the steps for testing the endpoint:  

---

#### **Testing `GET /api/weather/:city`**  

**Purpose**: Fetches weather information for a specific city.  

1. Open Postman and create a new request.  
2. Set the method to `GET` and the URL to:  
   ```
   http://localhost:3000/api/weather/<city_name>
   ```  
   Replace `<city_name>` with the name of the city you want to fetch weather data for (e.g., `London`).
3. Click **Send**.  

**Expected Responses**:  
- **Success**:  
  ```json
  {
    "name": "London",
    "main": {
      "temp": 15.5,
      "humidity": 72
    },
    "weather": [
      {
        "description": "clear sky"
      }
    ]
  }
  ```  
- **Error**:  
  ```json
  {
    "error": "Failed to fetch weather data"
  }
  ```  

---

#### **Additional Notes**  
- **Ensure the Server is Running**:  
  - Start your server by running:  
    ```bash
    node server.js
    ```  
  - Ensure there are no errors in the terminal, and the server is listening on the correct port (e.g., `3000`).  

- **Environment Variables**:  
  - Ensure your `.env` file contains the correct `WEATHER_API_KEY` and `PORT`.  

---

### Why is `weather.js` Important?
The `weather.js` file is is crucial for enabling weather-related functionality in the TravelGo backend. It ensures:
- Routes can fetch real-time weather data from an external API (e.g., OpenWeatherMap) 
- Endpoints are provided for the frontend to retrieve weather details based on user input, such as city names. 
- Seamless communication between the frontend and the weather API.

---