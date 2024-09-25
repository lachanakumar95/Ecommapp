const jwtUtils = require('../utils/jwt');

exports.verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token required' });

    try {
        const user = jwtUtils.verifyToken(token);
        req.user = user;  // Attaching user to request object
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};