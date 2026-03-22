const express = require('express');
const router = express.Router();

// Module imports 
const {
    createViewEvent,
    updateViewEvent,
    deleteViewEvent
} = require('../controllers/viewEvent');
const auth = require('../middlewares/auth.middleware');

// Protected routes configuration
router.post('/', auth, createViewEvent);
router.put('/', auth, updateViewEvent);
router.delete('/', auth, deleteViewEvent);

module.exports = router;

