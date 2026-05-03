const movieModel = require('../models/movieModel');
const seriesModel = require('../models/seriesModel');
const { viewEventModel } = require('../models/viewEventModel');

// FIXME: Optimize the tendencies charge bc it is N + 1 rn

// Checks for the most watched content
const getAllTendencies = async (req, res) => {
    try {
        const isKid = (req.isKid === true) || (req.query.isKid === 'true');

        const topEvents = await viewEventModel.selectTopViewEvents(40);

        if (!topEvents || topEvents.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const data = [];
        for (const event of topEvents) {
            if (data.length >= 10) break;

            const type = String(event.content_type).toLowerCase().trim();
            const id = String(event.content_id).trim();

            if (!id || id === 'undefined' || id === 'null') continue;

            let content;
            if (type === 'movie') content = await movieModel.selectMovieById(id);
            else if (type === 'series') content = await seriesModel.selectSeriesById(id);

            if (content) {
                if (isKid && !content.is_for_kids) continue;
                data.push(content);
            }
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message })
    }
}

// Checks for the most watched content (only movies)
const getMovieTendencies = async (req, res) => {
    try {
        const isKid = req.isKid ?? false;
        const entries = await viewEventModel.selectAllViewEvents();

        const tendenciesHashMap = new Map();

        for (const entry of entries) {
            if (entry.content_type !== 'movie') continue;
            const content = await movieModel.selectMovieById(entry.content_id);

            if (content) {
                if (isKid && !content.is_for_kids) continue;

                const contentIdStr = String(content._id);
                const current = tendenciesHashMap.get(contentIdStr) || { count: 0, content };
                current.count += 1;
                tendenciesHashMap.set(contentIdStr, current);
            }
        }

        const data = Array.from(tendenciesHashMap.values())
            .sort((a, b) => b.count - a.count)
            .map(item => item.content);

        if (data.length === 0) {
            return res.status(200).json({ success: true, msg: 'No tendencies yet.', data: [] });
        }

        res.status(200).json({ success: true, msg: 'Successfully retrieved tendencies.', data: data.slice(0, 10) });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message })
    }
}

// Checks for the most watched content (only series)
const getSeriesTendencies = async (req, res) => {
    try {
        const isKid = req.isKid ?? false;
        const entries = await viewEventModel.selectAllViewEvents();

        const tendenciesHashMap = new Map();

        for (const entry of entries) {
            if (entry.content_type !== 'series') continue;
            const content = await seriesModel.selectSeriesById(entry.content_id);

            if (content) {
                if (isKid && !content.is_for_kids) continue;

                const contentIdStr = String(content._id);
                const current = tendenciesHashMap.get(contentIdStr) || { count: 0, content };
                current.count += 1;
                tendenciesHashMap.set(contentIdStr, current);
            }
        }

        const data = Array.from(tendenciesHashMap.values())
            .sort((a, b) => b.count - a.count)
            .map(item => item.content);

        if (data.length === 0) {
            return res.status(200).json({ success: true, msg: 'No tendencies yet.', data: [] });
        }

        res.status(200).json({ success: true, msg: 'Successfully retrieved tendencies.', data: data.slice(0, 10) });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message })
    }
}

module.exports = {
    getAllTendencies,
    getMovieTendencies,
    getSeriesTendencies
}