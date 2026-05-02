const express = require('express');
const router = express.Router();

// Modules imports
const {
    createInteractionEvent,
    updateInteractionEvent,
    deleteInteractionEvent
} = require('../controllers/interactionEvent');
const auth = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: InteractionEvent
 *   description: Tracking user interactions (likes/dislikes).
 */

/**
 * @swagger
 * /api/interactionEvent:
 *   post:
 *     summary: Create a new interaction event.
 *     tags: [InteractionEvent]
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
 *               - interaction_type
 *             properties:
 *               profile_id:
 *                 type: string
 *               content_id:
 *                 type: string
 *               content_type:
 *                 type: string
 *                 enum: [movie, series]
 *               interaction_type:
 *                 type: string
 *                 enum: [like, dislike]
 *     responses:
 *       201:
 *         description: Interaction event created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/', auth, createInteractionEvent);

/**
 * @swagger
 * /api/interactionEvent:
 *   put:
 *     summary: Update an existing interaction event.
 *     tags: [InteractionEvent]
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
 *               - interaction_type
 *             properties:
 *               profile_id:
 *                 type: string
 *               content_id:
 *                 type: string
 *               interaction_type:
 *                 type: string
 *                 enum: [like, dislike]
 *     responses:
 *       200:
 *         description: Interaction event updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put('/', auth, updateInteractionEvent);

/**
 * @swagger
 * /api/interactionEvent:
 *   delete:
 *     summary: Delete an interaction event.
 *     tags: [InteractionEvent]
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
 *         description: Interaction event deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/', auth, deleteInteractionEvent);

module.exports = router;