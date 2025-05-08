const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT tokens
/** EXPLANATION
 * This middleware checks if the incoming request has a valid JWT token.
 * If the token is valid, it allows the request to proceed to the next middleware or route handler.
 * If not, it sends a 403 Forbidden response.
 * 
 * authenticateToken FUNCTION
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 * @return {void}
 */
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach the decoded user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken;