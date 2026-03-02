// middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
    // Allow any authenticated user (no role check)
    if (req.isAuthenticated()) {
        return next();
    }

    // For API routes (e.g., JWT-based requests)
    if (req.user) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
    });
};

module.exports = adminMiddleware;