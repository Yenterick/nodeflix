const express = require('express');
const router = express.Router();

// Modules imports
const {
    createListEvent,
    deleteListEvent
} = require('../controllers/listEvent');
const auth = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: ListEvent
 *   description: Managing user's personal bookmark list.
 */

/**
 * @swagger
 * /api/listEvent:
 *   post:
 *     summary: Add content to profile list.
 *     tags: [ListEvent]
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
 *     responses:
 *       201:
 *         description: Content added to list.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/', auth, createListEvent);

/**
 * @swagger
 * /api/listEvent:
 *   delete:
 *     summary: Remove content from profile list.
 *     tags: [ListEvent]
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
 *         description: Content removed from list.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/', auth, deleteListEvent);

module.exports = router;