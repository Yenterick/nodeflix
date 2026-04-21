const express = require('express');
const router = express.Router();

// Module imports
const {
    registerUser,
    loginUser,
    updateUserPassword,
    deleteUser,
    getUserProfiles
} = require('../controllers/user');
const auth = require('../middlewares/auth.middleware.js');

// Non-protected routes configuration
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes configuration
router.get('/profiles/:userId', auth, getUserProfiles);
router.post('/update/:userId', auth, updateUserPassword);
router.delete('/:userId', auth, deleteUser);

module.exports = router;