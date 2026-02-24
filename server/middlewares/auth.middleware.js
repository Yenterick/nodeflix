// Module imports
const { verifyToken } = require('../config/jwt');

// Checks the client headers for the token and validates it
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ success: false, msg: "Token required."});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, msg: "Invalid or expired token." });
    }
}