const express = require('express');
const router = express.Router();

// Module imports
const {
    createProfile,
    deleteProfile,
    updateProfile
} = require('../controllers/profile');
const { getProfileStartedContent, getProfileListContent, getProfileRecommendedContent } = require('../controllers/profileContext');
const auth = require('../middlewares/auth.middleware.js');
const kidFilter = require('../middlewares/kidFilter.middleware');

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Profile management and user-specific content context.
 */

/**
 * @swagger
 * /api/profile:
 *   post:
 *     summary: Create a new profile.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - profile_pic
 *               - user_id
 *             properties:
 *               name:
 *                 type: string
 *               profile_pic:
 *                 type: string
 *               user_id:
 *                 type: string
 *               is_for_kids:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Profile created.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, createProfile);

/**
 * @swagger
 * /api/profile/{profileId}:
 *   delete:
 *     summary: Delete a profile.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 */
router.delete('/:profileId', auth, deleteProfile);

/**
 * @swagger
 * /api/profile/{profileId}:
 *   put:
 *     summary: Update a profile.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               profile_pic:
 *                 type: string
 *               is_for_kids:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Profile updated.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 */
router.put('/:profileId', auth, updateProfile);

/**
 * @swagger
 * /api/profile/{profileId}/started:
 *   get:
 *     summary: Get started content for a profile.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: isKid
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Content retrieved.
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
 *       401:
 *         description: Unauthorized
 */
router.get('/:profileId/started', auth, kidFilter, getProfileStartedContent);

/**
 * @swagger
 * /api/profile/{profileId}/list:
 *   get:
 *     summary: Get bookmarked content for a profile.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: isKid
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Content retrieved.
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
 *       401:
 *         description: Unauthorized
 */
router.get('/:profileId/list', auth, kidFilter, getProfileListContent);

/**
 * @swagger
 * /api/profile/{profileId}/recommendedContent:
 *   get:
 *     summary: Get recommended content for a profile.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: isKid
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Content retrieved.
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
 *       401:
 *         description: Unauthorized
 */
router.get('/:profileId/recommendedContent', auth, kidFilter, getProfileRecommendedContent);

module.exports = router;