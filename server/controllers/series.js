const seriesModel = require('../models/seriesModel');

const getAllSeries = async (req, res) => {
    try {
        const series = await seriesModel.selectAllSeries();

        res.status(200).json({ success: true, msg: 'Series successfully retrieved.', data: series });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

const getSeries = async (req, res) => {
    try {
        const { seriesId } = req.params;

        const series = await seriesModel.getSeries(seriesId);
        res.status(200).json({ success: true, msg: 'Series successfully retrieved.', data: series });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

module.exports = {
    getAllSeries,
    getSeries
}