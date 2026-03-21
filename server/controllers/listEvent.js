// Module imports
const listEventModel = require('../models/listEventModel');

// Creates a new list event
const createListEvent = async (req, res) => {
    try {
        const { contentId, contentType, profileId } = req.body;
        await listEventModel.insertListEvent(contentId, contentType, profileId);

        res.status(201).json({ success: true, msg: 'List event successfully created.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Deletes a list event
const deleteListEvent = async (req, res) => {
    try {
        const { listEventId } = req.params;

        await listEventModel.deleteListEventById(listEventId);
        res.status(200).json({ success: true, msg: 'List event successfully deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

module.exports = {
    createListEvent,
    deleteListEvent
}