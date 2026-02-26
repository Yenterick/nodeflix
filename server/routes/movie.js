const express = require('express');
const router = express.router();

// Modules Import
const {
    getAllMovies,
    getMovie
} = require('../controllers/movie');
const auth = require('../middlewares/auth.middleware');

// Protected router configuration
router.get('/', auth, getAllMovies);
router.get('/:movieId', auth, getMovie);

module.exports = router;
