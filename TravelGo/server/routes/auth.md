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

### 4. **Testing the Endpoints**  

You can use **Postman** to test the `POST /register` and `POST /login` endpoints defined in `auth.js`. Below are the steps for testing each endpoint:  

---

#### **Testing `POST /register`**  

**Purpose**: To create a new user in the database.  

1. Open Postman and create a new request.  
2. Set the method to `POST` and the URL to:  
   ```
   http://localhost:3000/api/users/register
   ```  
3. Go to the **Body** tab, select **raw**, and set the type to **JSON**.  
4. Add the following JSON body:  
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```  
5. Click **Send**.  

**Expected Responses**:  
- **Success**:  
  ```json
  {
    "message": "User registered successfully"
  }
  ```  
- **Error (User already exists)**:  
  ```json
  {
    "message": "User already exists"
  }
  ```  

---

#### **Testing `POST /login`**  

**Purpose**: To authenticate a user and return a JWT token.  

1. Open Postman and create a new request.  
2. Set the method to `POST` and the URL to:  
   ```
   http://localhost:3000/api/users/login
   ```  
3. Go to the **Body** tab, select **raw**, and set the type to **JSON**.  
4. Add the following JSON body:  
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```  
5. Click **Send**.  

**Expected Responses**:  
- **Success**:  
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```  
- **Error (Invalid credentials)**:  
  ```json
  {
    "message": "Invalid credentials"
  }
  ```  
- **Error (User not found)**:  
  ```json
  {
    "message": "User not found"
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

- **Database Connection**:  
  - Verify that your MongoDB database is running and accessible.  
  - Check the `MONGODB_URI` in your `.env` file.  

- **Environment Variables**:  
  - Ensure your `.env` file contains the correct `JWT_SECRET` and `PORT`.  

- **Testing JWT Tokens**:  
  - After logging in, you can use the returned JWT token to test protected routes (if implemented). Add the token to the **Authorization** header in Postman:  
    ```
    Authorization: Bearer <jwt_token_here>
    ```  

---

### Why is `auth.js` Important?
The `auth.js` file is essential for managing user authentication in the TravelGo application. It ensures:
- Secure storage of user passwords.
- Verification of user credentials during login.
- Generation of JWT tokens for authenticated access to protected resources.

---