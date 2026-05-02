const express = require('express');
const router = express.Router();

// Module imports
const { getAllProfilePictures } = require('../controllers/profilePicture');
const auth = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: ProfilePicture
 *   description: Retrieving available profile pictures.
 */

/**
 * @swagger
 * /api/profilePicture:
 *   get:
 *     summary: Get all available profile pictures.
 *     tags: [ProfilePicture]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile pictures retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       content_name:
 *                         type: string
 *                       pictures:
 *                         type: array
 *                         items:
 *                           type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, getAllProfilePictures);

module.exports = router;
