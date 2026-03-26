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

// Protected router configuration
router.get('/', auth, getAllSeries);
router.get('/names', auth, getSeriesNames);
router.get('/:seriesId', auth, getSeries);
router.get('/:contentId/:profileId', auth, getContentDetails);
router.get('/tendencies', auth, getAllTendencies);
router.get('/seriesTendencies', auth, getSeriesTendencies);

module.exports = router;
