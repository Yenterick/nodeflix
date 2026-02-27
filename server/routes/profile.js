const express = require('express');
const router = express.Router();

// Module imports
const {
    createProfile,
    deleteProfile,
    updateProfile,
    getProfileViewEvents
    
} = require('../controllers/profile');
const auth = require('../middlewares/auth.middleware.js');

// Protected routes configuration
router.post('/', auth, createProfile);
router.delete('/:profileId', auth, deleteProfile);
router.put('/:profileId', auth, updateProfile);
router.get('/view_events', auth, getProfileViewEvents);

module.exports = router;