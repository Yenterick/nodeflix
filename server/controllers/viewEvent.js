// Module imports
const { viewEventModel } = require('../models/viewEventModel');

// Create a new view event
const createViewEvent = async (req, res) => {
    try {
        const { contentId, contentType, season, episode, watchedSeconds, completed, profileId } = req.body;
        await viewEventModel.insertViewEvent(contentId, contentType, season, episode, watchedSeconds, completed, profileId);

        res.status(201).json({ success: true, msg: 'View event successfully created.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

const updateViewEvent = async (req, res) => {
    try {
        const { contentId, contentType, profileId, watchedSeconds, completed, season, episode } = req.body;

        await viewEventModel.updateViewEventByParams(contentId, contentType, profileId, watchedSeconds, completed, season, episode);
        res.status(200).json({ success: true, msg: 'View event successfully updated.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

const deleteViewEvent = async (req, res) => {
    try {
        const { contentId, contentType, profileId } = req.body;

        await viewEventModel.deleteViewEventByParams(contentId, contentType, profileId);
        res.status(200).json({ success: true, msg: 'View event successfully deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

module.exports = {
    createViewEvent,
    updateViewEvent,
    deleteViewEvent
}