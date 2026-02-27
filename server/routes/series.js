const express = require('express');
const router = express.Router();

// Modules Import
const {
    getAllSeries,
    getSeries
} = require('../controllers/series');
const auth = require('../middlewares/auth.middleware');

// Protected router configuration
router.get('/', auth, getAllSeries);
router.get('/:seriesId', auth, getSeries);

module.exports = router;
