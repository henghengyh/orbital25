File: `authenticateToken.js` 
===
Created on 2025-05-07

### Initialisation

The `authenticateToken` middleware is responsible for verifying the validity of a JSON Web Token (JWT) included in the request's `Authorization` header. It ensures that only authenticated users can access protected routes.

---

### Explanation

#### 1. **Using it**

To use the `authenticateToken` middleware, import it into your route files (or directly to `server.js` for global application of middleware) and include it in the middleware chain for routes that require authentication.

```javascript
const authenticateToken = require('./middleware/authenticateToken');

// Example usage
app.use('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route.', user: req.user });
});
```

---

#### 2. **How does it work?**

1. The middleware extracts the token from the `Authorization` header.
2. If no token is provided, it responds with a `401 Unauthorized` status.
3. If a token is provided, it verifies the token using the secret key stored in the environment variable `ACCESS_TOKEN_SECRET`.
4. If the token is invalid or expired, it responds with a `403 Forbidden` status.
5. If the token is valid, it attaches the decoded user information to the `req.user` object and calls the `next()` function to proceed to the next middleware or route handler.

---

#### 3. **Error handling**

- **401 Unauthorized**: Returned when no token is provided in the `Authorization` header.
- **403 Forbidden**: Returned when the provided token is invalid or expired.

---

#### **Additional Notes**
- **Environment variables required**
    - `ACCESS_TOKEN_SECRET`: The secret key used to sign and verify JWTs. This must be set in your environment variables.
    **Example code**:

    ```javascript
    // filepath: /Users/yiheng/Documents/GitHub/orbital25/TravelGo/server/middleware/authenticateToken.js
    const jwt = require('jsonwebtoken');

    function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.sendStatus(401);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    }

    module.exports = authenticateToken;
    ```
    - Ensure that the `ACCESS_TOKEN_SECRET` is kept secure and not exposed in your codebase.
    - Use this middleware for routes that require user authentication.