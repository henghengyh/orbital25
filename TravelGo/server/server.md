File: `package.json` 
===
Created on 2025-05-01

# Initialisation
The `server.js` file is the main entry point for the backend of the TravelGo application. It initializes the server, sets up middleware, connects to the database, and defines routes for handling user requests. This file ensures that the backend is properly configured and ready to handle incoming requests and responses.

# Explanation
The `server.js` file is like the control center of the backend for the TravelGo application. It sets up the server, connects to the database, and handles requests from users. Here's a breakdown of what it does:

1. Setup:
    - The file starts by loading tools and libraries that the server needs to work:
        - `dotenv`: Loads secret settings (like database passwords) from a hidden file.
        - `express`: Helps the server handle requests from users.
        - `mongoose`: Helps the server talk to the database.
        - `passport`: Manages user login and authentication.
        - `cors`: Allows the server to accept requests from other websites or apps.
2. Middleware:
    - Middleware is like a set of helpers that process requests before they reach the main logic:
        - `express.json()`: Makes sure the server can understand data sent in JSON format.
        - `cors()`: Allows requests from other websites or apps.
        - `passport.initialize()`: Prepares the server to handle user authentication.
3. Database Connection:
    - The server connects to a **MongoDB database** using `mongoose`. This is where all the app's data (like user accounts or itineraries) is stored.
    - The connection details are stored in a hidden file for security.
4. Routes:
    - Routes are like paths that users can visit to perform actions:
        - `/api/users`: Handles user-related actions (e.g. signing up or logging in).
        - `/api/itineraries`: Handles actions related to travel itineraries.
5. Starting the server:
    - The server listens for requests on a specific port (e.g. `5000`).
    - When the server starts, it prints a message like: `Server running on port 5000`.

### Why is `server.js` important?
This file is the **brain** of the backend. It ensures that:
    - The app can talk to the database.
    - Users can log in and interact with the app.
    - The server is always ready to handle requests.