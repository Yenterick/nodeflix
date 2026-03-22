// Module imports
const { listEventModel } = require('../models/listEventModel');
const { viewEventModel } = require('../models/viewEventModel');
const { interactionEventModel } = require('../models/interactionEventModel');

// Checks for content details
const getContentDetails = async (req, res) => {
    try {
        const { contentId, profileId } = req.params;

        const isMovie = req.baseUrl.includes('movie');
        const contentType = isMovie ? 'movie' : 'series';

        const [listEvent, interactionEvent, viewEvent] = await Promise.all([
            listEventModel.selectListEventByParams(contentId, contentType, profileId),
            interactionEventModel.selectInteractionEventByParams(contentId, contentType, profileId),
            viewEventModel.selectViewEventByParams(contentId, contentType, profileId)
        ]);

        const data = {
            isInList: !!listEvent,
            interaction: (interactionEvent?.interaction_type || undefined),
            watchedProgress: viewEvent ? {
                completed: viewEvent?.completed,
                season: viewEvent?.season || undefined,
                episode: viewEvent?.episode || undefined,
                watchedSeconds: viewEvent?.watched_seconds
            } : undefined
        };

        res.status(200).json({ success: true, msg: 'Content details successfully retrieved.', data: data })
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }

}

module.exports = {
    getContentDetails
}