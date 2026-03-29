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
const kidFilter = require('../middlewares/kidFilter.middleware');

// Protected routes configuration
router.post('/:kidCheck', auth, createProfile);
router.delete('/:profileId', auth, deleteProfile);
router.put('/:profileId', auth, updateProfile);
router.get('/:profileId/started', auth, kidFilter, getProfileStartedContent);
router.get('/:profileId/list', auth, kidFilter, getProfileListContent);
router.get('/:profileId/recommendedContent', auth, kidFilter, getProfileRecommendedContent);

module.exports = router;