const express = require('express');
const router = express.Router();

// Modules imports
const {
    getAllMovies,
    getMovie
} = require('../controllers/movie');
const auth = require('../middlewares/auth.middleware');

// Protected routes configuration
router.get('/', auth, getAllMovies);
router.get('/:movieId', auth, getMovie);

module.exports = router;
