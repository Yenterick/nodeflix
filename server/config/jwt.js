const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');

//TODO: Remove when implementing Dockerfile
const envPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath, quiet: true });

// Getting the JWT secret key
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Generates the secret token that clients saves
function generateToken (user) {
  return jwt.sign(
    { id: user.user_id, email: user.email },
    SECRET_KEY,
    { expiresIn: "1d" } 
  );
}

// Verifies if the token is valid
function verifyToken (token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };