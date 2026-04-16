const express = require('express');
const router = express.Router();

// Module imports
const { getAllProfilePictures } = require('../controllers/profilePicture');

// Non-protected routes configuration
router.get('/', getAllProfilePictures);

module.exports = router;