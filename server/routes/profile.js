const express = require('express');
const router = express.Router();

// Module imports
const {
    createProfile,
    deleteProfile,
    updateProfile
} = require('../controllers/profile');
const { getProfileStartedContent, getProfileListContent, getProfileRecommendedContent } = require('../controllers/profileContext');
const auth = require('../middlewares/auth.middleware.js');

// Protected routes configuration
router.post('/', auth, createProfile);
router.delete('/:profileId', auth, deleteProfile);
router.put('/:profileId', auth, updateProfile);
router.get('/:profileId/started', auth, getProfileStartedContent);
router.get('/:profileId/list', auth, getProfileListContent);
router.get('/:profileId/recommendedContent', auth, getProfileRecommendedContent);

module.exports = router;