// Module imports
const { verifyToken } = require('../config/jwt');
const { User } = require('../models/userModel');

// Checks the client headers for the token and validates it
module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ success: false, msg: "Token required."});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        
        // Verify user still exists in the database
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, msg: "User account no longer exists." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, msg: "Invalid or expired token." });
    }
}