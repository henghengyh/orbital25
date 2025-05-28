const authenticateRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if the user is authenticated
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        next();
    }
};

module.exports = authenticateRoles;