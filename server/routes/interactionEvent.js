const express = require('express');
const router = express.Router();

// Modules imports
const {
    createInteractionEvent,
    updateInteractionEvent,
    deleteInteractionEvent
} = require('../controllers/interactionEvent');
const auth = require('../middlewares/auth.middleware');

// Protected routes configuration
router.post('/', auth, createInteractionEvent);
router.put('/:interactionEventId', auth, updateInteractionEvent);
router.delete('/:interactionEventId', auth, deleteInteractionEvent);

module.exports = router;