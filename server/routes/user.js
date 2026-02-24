const express = require('express');
const router = express.Router();

// Module imports
const {
    registerUser,
    loginUser
} = require('../controllers/user');

// Routes configuration
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;