File: `auth.js` 
===
Created on 2025-05-07

### Initialisation
The `auth.js` file defines the routes for user authentication in the TravelGo backend. It handles user registration and login, ensuring secure password storage and user verification using `bcryptjs` and `jsonwebtoken`. This file is a critical part of the backend, enabling users to create accounts, log in, and receive authentication tokens for accessing protected resources.

---

### Explanation

#### 1. **Dependencies**
The file imports the following libraries:
- **`express`**: To define routes and handle HTTP requests.
- **`bcryptjs`**: For securely hashing and comparing passwords.
- **`jsonwebtoken`**: For generating JSON Web Tokens (JWT) to authenticate users.
- **`User`**: The Mongoose model for interacting with the `users` collection in the database.

---

#### 2. **Routes**

##### **`POST /register`**
- **Purpose**: Handles user registration.
- **Process**:
  1. Checks if a user with the provided email already exists using `User.findOne`.
  2. If the user exists, returns a `400` status with an error message.
  3. If the user does not exist:
     - Creates a new user instance with the provided `name`, `email`, and `password`.
     - Saves the user to the database using `user.save()`.
  4. Returns a `201` status with a success message if the registration is successful.
- **Error Handling**: Returns a `500` status with a "Server error" message if an exception occurs.

##### **`POST /login`**
- **Purpose**: Handles user login.
- **Process**:
  1. Checks if a user with the provided email exists using `User.findOne`.
  2. If the user does not exist, returns a `404` status with an error message.
  3. If the user exists:
     - Compares the provided password with the hashed password in the database using `bcrypt.compare`.
     - If the password does not match, returns a `400` status with an error message.
     - If the password matches:
       - Generates a JWT token using `jwt.sign` with the user's ID and a secret key.
       - Returns a `200` status with the token and user details.
- **Error Handling**: Returns a `500` status with a "Server error" message if an exception occurs.

---

#### 3. **Security Features**
- **Password Hashing**:
  - Passwords are hashed using `bcryptjs` before being stored in the database.
  - During login, the hashed password is compared with the provided password to verify the user's identity.
- **JWT Authentication**:
  - A JWT token is generated upon successful login.
  - The token contains the user's ID and is signed with a secret key (`process.env.JWT_SECRET`).
  - The token expires after 1 hour (`expiresIn: '1h'`).

---

### Why is `auth.js` Important?
The `auth.js` file is essential for managing user authentication in the TravelGo application. It ensures:
- Secure storage of user passwords.
- Verification of user credentials during login.
- Generation of JWT tokens for authenticated access to protected resources.

---