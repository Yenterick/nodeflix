const mongoose = require('mongoose');

// Creates the mongoose series schema
const seriesSchema = new mongoose.Schema({
    title: String,
    description: String,
    genres: [String],
    cast: [String],
    release_year: Number,
    thumbnail_url: String,
    is_for_kids: Boolean,
    created_at: { type: Date, default: Date.now },
    seasons: [
        {
            season_number: Number,
            episodes: [
                {
                    episode_number: Number,
                    title: String,
                    description: String,
                    duration: Number,
                    thumbnail_url: String,
                    stream_url: String
                }
            ]
        }
    ]
});

// Converts the series schema into a model
const Series = mongoose.model('Series', seriesSchema);

// Series model with all the required functions
const seriesModel = {
    selectAllSeries : async (isKid = false) => {
        const filter = isKid ? { is_for_kids: true } : {};
        return (
            await Series.find(filter)
        );
    },

    selectSeriesById : async (id) => {
        return (
            await Series.findById(id)
        ); 
    },

    selectSeriesByGenresPrecise : async (genres, isKid = false) => { 
        const filter = { genres: { $all: genres } };
        if (isKid) filter.is_for_kids = true;
        return (
            await Series.find(filter)
        );
    },

    selectSeriesByGenres : async (genres, excludeIds, isKid = false) => { 
        const filter = { genres: { $in: genres }, _id: { $nin: excludeIds } };
        if (isKid) filter.is_for_kids = true;
        return (
            await Series.find(filter)
        );
    },

    selectSeriesBySearch : async (search, isKid = false) => {
        const filter = { title: { $regex: `^${search}`, $options: 'i' } };
        if (isKid) filter.is_for_kids = true;
        return (
            await Series.find(filter)
        );
    },

    selectSeriesNames : async () => {
        return (
            await Series.find({}, 'title _id')
        );
    }
}

module.exports = seriesModel;