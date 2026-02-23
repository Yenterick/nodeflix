const mongoose = require('mongoose');

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

const Series = mongoose.model('Series', seriesSchema);
const seriesModel = {
    selectAllSeries: async () => {
        return (await Series.find());
    },

    selectSeriesByGenre: async (genres) => { 
        return (await Series.find({ genres: {$all: genres} }));
    },

    selectSeriesBySearch: async (search) => {
        return (await Series.find({ $regex: `^${search}`, $options: 'i' }));
    }
}

module.exports = seriesModel;