const express = require('express');
const router = express.Router();

// Modules Import
const {
    getAllSeries,
    getSeries,
    getSeriesNames
} = require('../controllers/series');
const { getContentDetails } = require('../controllers/profileContext');
const { getAllTendencies, getSeriesTendencies } = require('../controllers/contentContext');
const auth = require('../middlewares/auth.middleware');
const kidFilter = require('../middlewares/kidFilter.middleware');

// Protected routes configuration
router.get('/:kidCheck', auth, getAllSeries);
router.get('/names', auth, getSeriesNames);
router.get('/details/:seriesId', auth, getSeries);
router.get('/:contentId/:profileId', auth, getContentDetails);
router.get('/tendencies', auth, kidFilter, getAllTendencies);
router.get('/seriesTendencies', auth, kidFilter, getSeriesTendencies);

module.exports = router;
