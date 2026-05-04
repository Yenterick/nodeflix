const seriesModel = require('../models/seriesModel');

// Searches series by title and/or genre
const searchSeries = async (req, res) => {
    try {
        const isKid = req.params.kidCheck === 'kid';
        const { q, genre } = req.query;

        let series;
        if (q && typeof q === 'string' && q.trim() !== '') {
            series = await seriesModel.selectSeriesBySearch(q.trim(), isKid);
        } else if (genre && genre !== 'All') {
            series = await seriesModel.selectSeriesByGenresPrecise([genre], isKid);
        } else {
            series = await seriesModel.selectAllSeries(isKid);
        }

        if (q && typeof q === 'string' && q.trim() !== '' && genre && genre !== 'All') {
            series = series.filter(s => s.genres && s.genres.includes(genre));
        }

        res.status(200).json({ success: true, msg: 'Series search results retrieved.', data: series });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Selects all the series

const getAllSeries = async (req, res) => {
    try {
        const isKid = req.params.kidCheck === 'kid';
        let series = await seriesModel.selectAllSeries(isKid);
        series.sort(() => Math.random() - 0.5);

        res.status(200).json({ success: true, msg: 'Series successfully retrieved.', data: series });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Selects a series
const getSeries = async (req, res) => {
    try {
        const { seriesId } = req.params;

        const series = await seriesModel.selectSeriesById(seriesId);
        res.status(200).json({ success: true, msg: 'Series successfully retrieved.', data: series });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

const getSeriesNames = async (req, res) => {
    try {
        const series = await seriesModel.selectSeriesNames();
        res.status(200).json({ success: true, msg: 'Series names and IDs successfully retrieved.', data: series });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

module.exports = {
    getAllSeries,
    getSeries,
    getSeriesNames,
    searchSeries
}