const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };