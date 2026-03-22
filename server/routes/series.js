const express = require('express');
const router = express.Router();

// Modules Import
const {
    getAllSeries,
    getSeries
} = require('../controllers/series');
const { getContentDetails } = require('../controllers/profileContext');
const auth = require('../middlewares/auth.middleware');

// Protected router configuration
router.get('/', auth, getAllSeries);
router.get('/:seriesId', auth, getSeries);
router.get('/:contentId/:profileId', auth, getContentDetails);

module.exports = router;
