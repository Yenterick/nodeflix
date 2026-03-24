const express = require('express');
const router = express.Router();

// Modules imports
const {
    getAllMovies,
    getMovie
} = require('../controllers/movie');
const { getContentDetails } = require('../controllers/profileContext');
const { getAllTendencies, getMovieTendencies } = require('../controllers/contentContext');
const auth = require('../middlewares/auth.middleware');

// Protected routes configuration
router.get('/', auth, getAllMovies);
router.get('/:movieId', auth, getMovie);
router.get('/:contentId/:profileId', auth, getContentDetails);
router.get('/tendencies', auth, getAllTendencies);
router.get('/movieTendencies', auth, getMovieTendencies);

module.exports = router;
