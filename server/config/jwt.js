const jwt = require('jsonwebtoken');

// Getting the JWT secret key
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Generates the secret token that clients saves
function generateToken (user) {
  return jwt.sign(
    { id: user.user_id, email: user.email },
    SECRET_KEY,
    // { expiresIn: "1d" } 
  );
}

// Verifies if the token is valid
function verifyToken (token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };