const express = require('express');
const router = express.Router();

// Module imports 
const {
    createViewEvent,
    updateViewEvent,
    deleteViewEvent
} = require('../controllers/viewEvent');
const auth = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: ViewEvent
 *   description: Tracking watch progress and view history.
 */

/**
 * @swagger
 * /api/viewEvent:
 *   post:
 *     summary: Create a new view event.
 *     tags: [ViewEvent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profile_id
 *               - content_id
 *               - content_type
 *             properties:
 *               profile_id:
 *                 type: string
 *               content_id:
 *                 type: string
 *               content_type:
 *                 type: string
 *                 enum: [movie, series]
 *               season:
 *                 type: number
 *               episode:
 *                 type: number
 *               watched_seconds:
 *                 type: number
 *     responses:
 *       201:
 *         description: View event created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/', auth, createViewEvent);

/**
 * @swagger
 * /api/viewEvent:
 *   put:
 *     summary: Update an existing view event (watch progress).
 *     tags: [ViewEvent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profile_id
 *               - content_id
 *               - watched_seconds
 *             properties:
 *               profile_id:
 *                 type: string
 *               content_id:
 *                 type: string
 *               watched_seconds:
 *                 type: number
 *     responses:
 *       200:
 *         description: View event updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put('/', auth, updateViewEvent);

/**
 * @swagger
 * /api/viewEvent:
 *   delete:
 *     summary: Delete a view event.
 *     tags: [ViewEvent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profile_id
 *               - content_id
 *             properties:
 *               profile_id:
 *                 type: string
 *               content_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: View event deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/', auth, deleteViewEvent);

module.exports = router;


