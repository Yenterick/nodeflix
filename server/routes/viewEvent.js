const express = require('express');
const router = express.router();

// Module imports 
const {
    createViewEvent,
    updateViewEvent,
    deleteViewEvent
} = require('../controllers/viewEvent');
const auth = require('../middlewares/auth.middleware');

// Protected routes configuration
router.post('/', auth, createViewEvent);
router.put('/:viewEventId', auth, updateViewEvent);
router.delete('/:viewEventId', auth, deleteViewEvent);

