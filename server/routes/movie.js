const express = require('express');
const router = express.Router();

// Modules imports
const {
    getAllMovies,
    getMovie,
    getMovieNames
} = require('../controllers/movie');
const { getContentDetails } = require('../controllers/profileContext');
const { getAllTendencies, getMovieTendencies } = require('../controllers/contentContext');
const auth = require('../middlewares/auth.middleware');
const kidFilter = require('../middlewares/kidFilter.middleware');

// Protected routes configuration
router.get('/:kidCheck', auth, getAllMovies);
router.get('/names', auth, getMovieNames);
router.get('/details/:movieId', auth, getMovie);
router.get('/:contentId/:profileId', auth, getContentDetails);
router.get('/tendencies', auth, kidFilter, getAllTendencies);
router.get('/movieTendencies', auth, kidFilter, getMovieTendencies);

module.exports = router;
