const express = require('express');
const router = express.Router();

// Modules Import
const {
    getAllSeries,
    getSeries,
    getSeriesNames,
    searchSeries
} = require('../controllers/series');
const { getContentDetails } = require('../controllers/profileContext');
const { getAllTendencies, getSeriesTendencies } = require('../controllers/contentContext');
const auth = require('../middlewares/auth.middleware');
const kidFilter = require('../middlewares/kidFilter.middleware');

/**
 * @swagger
 * tags:
 *   name: Series
 *   description: Series retrieval and metadata.
 */

/**
 * @swagger
 * /api/series/{kidCheck}:
 *   get:
 *     summary: Get all series.
 *     tags: [Series]
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
 *         description: Series retrieved.
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
 *                         $ref: '#/components/schemas/Series'
 */
/**
 * @swagger
 * /api/series/search/{kidCheck}:
 *   get:
 *     summary: Search series by title and/or genre.
 *     tags: [Series]
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
router.get('/search/:kidCheck', auth, searchSeries);

router.get('/:kidCheck', auth, getAllSeries);

/**
 * @swagger
 * /api/series/names:
 *   get:
 *     summary: Get all series names.
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Series names retrieved.
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
router.get('/names', auth, getSeriesNames);

/**
 * @swagger
 * /api/series/details/{seriesId}:
 *   get:
 *     summary: Get series details by ID.
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seriesId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Series details retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Series'
 */
router.get('/details/:seriesId', auth, getSeries);

/**
 * @swagger
 * /api/series/{contentId}/{profileId}:
 *   get:
 *     summary: Get content details for a specific profile.
 *     tags: [Series]
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
 * /api/series/tendencies:
 *   get:
 *     summary: Get all trending content.
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
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
 * /api/series/seriesTendencies:
 *   get:
 *     summary: Get trending series.
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Series tendencies retrieved.
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
 *                         $ref: '#/components/schemas/Series'
 */
router.get('/seriesTendencies', auth, kidFilter, getSeriesTendencies);

module.exports = router;

