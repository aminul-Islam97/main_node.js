const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const jwtAuthMiddleware = (req, res, next) => {
    try {
        // Extract the JWT token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT Error:', err);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

// Function to generate a JWT token
const generateToken = (userData) => {
    // Optionally, set expiration time like { expiresIn: '1h' }
    return jwt.sign({userData}, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { jwtAuthMiddleware, generateToken };
