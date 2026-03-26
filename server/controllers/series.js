const seriesModel = require('../models/seriesModel');

// Selects all the series
const getAllSeries = async (req, res) => {
    try {
        const series = await seriesModel.selectAllSeries();

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
    getSeriesNames
}