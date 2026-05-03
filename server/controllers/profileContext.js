// Module imports
const { listEventModel } = require('../models/listEventModel');
const { viewEventModel } = require('../models/viewEventModel');
const { interactionEventModel } = require('../models/interactionEventModel');
const { profileModel } = require('../models/profileModel');
const movieModel = require('../models/movieModel');
const seriesModel = require('../models/seriesModel');


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

// Checks for all the profile started content
const getProfileStartedContent = async (req, res) => {
    try {
        const isKid = req.isKid ?? false;
        const { profileId } = req.params;
        const entries = await profileModel.selectProfileViewEvents(profileId);

        let data = [];
        const seenIds = new Set();

        for (const entry of entries) {
            if (entry.completed) continue;
            if (seenIds.has(entry.content_id)) continue;
            seenIds.add(entry.content_id);

            let content;
            if (entry.content_type === 'movie') content = await movieModel.selectMovieById(entry.content_id);
            else content = await seriesModel.selectSeriesById(entry.content_id);

            if (content) {
                if (isKid && !content.is_for_kids) continue;
                data.push(content);
            }
        }

        data.sort(() => Math.random() - 0.5);

        res.status(200).json({ success: true, msg: 'Content details successfully retrieved.', data: data })
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Checks for all the profile list content
const getProfileListContent = async (req, res) => {
    try {
        const isKid = req.isKid ?? false;
        const { profileId } = req.params;
        const entries = await profileModel.selectProfileListEvents(profileId);

        let data = [];
        const seenIds = new Set();

        for (const entry of entries) {
            if (seenIds.has(entry.content_id)) continue;
            seenIds.add(entry.content_id);

            let content;
            if (entry.content_type === 'movie') content = await movieModel.selectMovieById(entry.content_id);
            else content = await seriesModel.selectSeriesById(entry.content_id);

            if (content) {
                if (isKid && !content.is_for_kids) continue;
                data.push(content);
            }
        }

        data.sort(() => Math.random() - 0.5);

        res.status(200).json({ success: true, msg: 'Content details successfully retrieved.', data: data })
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

const getProfileRecommendedContent = async (req, res) => {
    /*
    This function handles the preferences of the profile as
    a points system, adding 2 points if the profile liked the content,
    subtracting 2 otherwise, and getting 1 point if the user watched the
    entire movie/series. The points system will be stored in a hashmap
    using the genre as the key and the points as the value.
    */
    try {
        const isKid = req.isKid ?? false;
        const { profileId } = req.params;

        const viewEvents = await profileModel.selectProfileViewEvents(profileId);
        const seenIds = new Set(viewEvents.map(e => e.content_id));
        const watchedEntries = await profileModel.selectProfileCompletedViewEvents(profileId);
        const interactedEntries = await profileModel.selectProfileInteractionEvents(profileId);

        const preferencesHashMap = new Map();

        for (const entry of watchedEntries) {
            let content;
            if (entry.content_type === 'movie') {
                content = await movieModel.selectMovieById(entry.content_id);
            } else {
                content = await seriesModel.selectSeriesById(entry.content_id);
            }

            if (content) {
                if (isKid && !content.is_for_kids) continue;
                for (const genre of content.genres) {
                    preferencesHashMap.set(genre, (preferencesHashMap.get(genre) || 0) + 1);
                }
            }
        }

        for (const entry of interactedEntries) {
            seenIds.add(entry.content_id);

            let content;
            if (entry.content_type === 'movie') {
                content = await movieModel.selectMovieById(entry.content_id);
            } else {
                content = await seriesModel.selectSeriesById(entry.content_id);
            }

            if (content && content.genres) {
                if (isKid && !content.is_for_kids) continue;
                const points = entry.interaction_type === 'like' ? 2 : -2;
                for (const genre of content.genres) {
                    preferencesHashMap.set(genre, (preferencesHashMap.get(genre) || 0) + points);
                }
            }
        }

        const preferredGenres = Array.from(preferencesHashMap.entries())
            .filter(([genre, points]) => points > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([genre, points]) => genre);

        if (preferredGenres.length === 0) {
            return res.status(200).json({ success: true, msg: 'No preferences yet.', data: [] });
        }

        const [candidateMovies, candidateSeries] = await Promise.all([
            movieModel.selectMoviesByGenres(preferredGenres, Array.from(seenIds), isKid),
            seriesModel.selectSeriesByGenres(preferredGenres, Array.from(seenIds), isKid)
        ]);

        const candidates = [...candidateMovies, ...candidateSeries];

        candidates.sort((a, b) => {
            let scoreA = 0;
            for (const genre of a.genres) scoreA += preferencesHashMap.get(genre) || 0;
            let scoreB = 0;
            for (const genre of b.genres) scoreB += preferencesHashMap.get(genre) || 0;
            return scoreB - scoreA;
        });

        res.status(200).json({ success: true, msg: 'Successfully retrieved recommended content.', data: candidates.slice(0, 10) });

    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}


module.exports = {
    getContentDetails,
    getProfileStartedContent,
    getProfileListContent,
    getProfileRecommendedContent
}
