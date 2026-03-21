// Module imports 
const interactionEventModel = require('../models/interactionEventModel');

// Creates a new interaction event
const createInteractionEvent = async (req, res) => {
    try {
        const { interactionType, contentId, contentType, profileId } = req.body
        await interactionEventModel.insertInteractionEvent(interactionType, contentId, contentType, profileId);

        res.status(201).json({ success: true, msg: 'Interaction event successfully created.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Updates an interaction event 
const updateInteractionEvent = async (req, res) => {
    try {
       const { interactionEventId } = req.params;
       const { interactionType } = req.body;

       await interactionEventModel.updateInteractionEventById(interactionEventId, interactionType);
       res.status(200).json({ success: true, msg: 'Interaction event successfully updated.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Deletes an interaction event
const deleteInteractionEvent = async (req, res) => {
    try {
        const { interactionEventId } = req.params;

        await interactionEventModel.deleteInteractionEventById(interactionEventId);
        res.status(200).json({ success: true, msg: 'Interaction event successfully deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

module.exports = {
    createInteractionEvent,
    updateInteractionEvent,
    deleteInteractionEvent
}