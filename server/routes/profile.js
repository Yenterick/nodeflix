const express = require('express');
const router = express.Router();

// Module imports
const {
    createProfile,
    deleteProfile,
    updateProfile
} = require('../controllers/profile');
const auth = require('../middlewares/auth.middleware.js');

// Protected routes configuration
// TODO: Insert the middleware
router.post('/', createProfile);
router.delete('/:profileId', deleteProfile);
router.put('/:profileId', updateProfile);

module.exports = router;