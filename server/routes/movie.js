const express = require('express');
const router = express.Router();

// Modules imports
const {
    getAllMovies,
    getMovie,
    getMovieNames,
    searchMovies
} = require('../controllers/movie');
const { getContentDetails } = require('../controllers/profileContext');
const { getAllTendencies, getMovieTendencies } = require('../controllers/contentContext');
const auth = require('../middlewares/auth.middleware');
const kidFilter = require('../middlewares/kidFilter.middleware');

/**
 * @swagger
 * tags:
 *   name: Movie
 *   description: Movie retrieval and metadata.
 */

/**
 * @swagger
 * /api/movie/tendencies:
 *   get:
 *     summary: Get all trending content (movies and series).
 *     tags: [Movie]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isKid
 *         schema:
 *           type: boolean
 *         description: Filter for kids-only content.
 *     responses:
 *       200:
 *         description: Tendencies retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         oneOf:
 *                           - $ref: '#/components/schemas/Movie'
 *                           - $ref: '#/components/schemas/Series'
 */
router.get('/tendencies', auth, kidFilter, getAllTendencies);

/**
 * @swagger
 * /api/movie/movieTendencies:
 *   get:
 *     summary: Get trending movies only.
 *     tags: [Movie]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Movie tendencies retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Movie'
 */
router.get('/movieTendencies', auth, kidFilter, getMovieTendencies);

/**
 * @swagger
 * /api/movie/search/{kidCheck}:
 *   get:
 *     summary: Search movies by title and/or genre.
 *     tags: [Movie]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kidCheck
 *         required: true
 *         schema:
 *           type: string
 *           enum: [kid, all]
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Title search query.
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Genre filter.
 *     responses:
 *       200:
 *         description: Search results retrieved.
 */
router.get('/search/:kidCheck', auth, searchMovies);

/**
 * @swagger
 * /api/movie/names:
 *   get:
 *     summary: Get all movie names.
 *     tags: [Movie]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Movie names retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id: { type: 'string' }
 *                           title: { type: 'string' }
 */
router.get('/names', auth, getMovieNames);

/**
 * @swagger
 * /api/movie/details/{movieId}:
 *   get:
 *     summary: Get movie details by ID.
 *     tags: [Movie]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie details retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Movie'
 */
router.get('/details/:movieId', auth, getMovie);

/**
 * @swagger
 * /api/movie/{contentId}/{profileId}:
 *   get:
 *     summary: Get content details for a specific profile.
 *     tags: [Movie]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content details retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 */
router.get('/:contentId/:profileId', auth, getContentDetails);

/**
 * @swagger
 * /api/movie/{kidCheck}:
 *   get:
 *     summary: Get all movies.
 *     tags: [Movie]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kidCheck
 *         required: true
 *         schema:
 *           type: string
 *           enum: [kid, all]
 *     responses:
 *       200:
 *         description: Movies retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Movie'
 */
router.get('/:kidCheck', auth, getAllMovies);

module.exports = router;
