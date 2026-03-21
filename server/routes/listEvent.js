const express = require('express');
const router = express.Router();

// Modules imports
const {
    createListEvent,
    deleteListEvent
} = require('../controllers/listEvent');
const auth = require('../middlewares/auth.middleware');

// Protected routes configuration
router.post('/', auth, createListEvent);
router.delete('/:listEventId', auth, deleteListEvent);

module.exports = router;