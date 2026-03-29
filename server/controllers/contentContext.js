const movieModel = require('../models/movieModel');
const seriesModel = require('../models/seriesModel');
const { viewEventModel } = require('../models/viewEventModel');

// FIXME: Optimize the tendencies charge bc it is N + 1 rn

// Checks for the most watched content
// Uses req.isKid (injected by kidFilter middleware) to filter kids-only content
const getAllTendencies = async (req, res) => {
    try {
        const isKid = req.isKid ?? false;
        const entries = await viewEventModel.selectAllViewEvents();

        const tendenciesHashMap = new Map();

        for (const entry of entries) {
            let content;
            if (entry.content_type === 'movie') {
                content = await movieModel.selectMovieById(entry.content_id);
            } else {
                content = await seriesModel.selectSeriesById(entry.content_id);
            }

            if (content) {
                // If kid profile, skip content that is not for kids
                if (isKid && !content.is_for_kids) continue;
                tendenciesHashMap.set(content._id, (tendenciesHashMap.get(content._id) || 0) + 1);
            }
        }

        const data = Array.from(tendenciesHashMap.entries())
            .sort((a, b) => b[1] - a[1]);

        if (data.length === 0) {
            return res.status(200).json({ success: true, msg: 'No tendencies yet.', data: [] });
        }

        res.status(200).json({ success: true, msg: 'Successfully retrieved tendencies.', data: data.slice(0, 10) });
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
            let content;
            if (entry.content_type === 'movie') {
                content = await movieModel.selectMovieById(entry.content_id);
            } else {
                // pass
            }

            if (content) {
                if (isKid && !content.is_for_kids) continue;
                tendenciesHashMap.set(content._id, (tendenciesHashMap.get(content._id) || 0) + 1);
            }
        }

        const data = Array.from(tendenciesHashMap.entries())
            .sort((a, b) => b[1] - a[1]);

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
            let content;
            if (entry.content_type === 'movie') {
                // pass
            } else {
                content = await seriesModel.selectSeriesById(entry.content_id);
            }

            if (content) {
                if (isKid && !content.is_for_kids) continue;
                tendenciesHashMap.set(content._id, (tendenciesHashMap.get(content._id) || 0) + 1);
            }
        }

        const data = Array.from(tendenciesHashMap.entries())
            .sort((a, b) => b[1] - a[1]);

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