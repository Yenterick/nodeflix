const mongoose = require('mongoose');

// Creates the mongoose movie Schema
const movieSchema = new mongoose.Schema({
    title: String,
    description: String,
    genres: [String],
    cast: [String],
    release_year: Number,
    duration: Number,
    thumbnail_url: String,
    stream_url: String,
    is_for_kids: Boolean,
    created_at: { type: Date, default: Date.now }
});

// Converts the movie schema into a model
const Movie = mongoose.model('Movie', movieSchema);

// Movie model with all the required functions
const movieModel = {
    selectAllMovies: async (isKid = false) => {
        const filter = isKid ? { is_for_kids: true } : {};
        return await Movie.aggregate([
            { $match: filter },
            { $addFields: { randomOrder: { $rand: {} } } },
            { $sort: { randomOrder: 1 } },
            { $project: { randomOrder: 0 } }
        ]);
    },

    selectMovieById: async (id) => {
        return (
            await Movie.findById(id)
        );
    },

    selectMoviesByGenresPrecise: async (genres, isKid = false) => {
        const filter = { genres: { $all: genres } };
        if (isKid) filter.is_for_kids = true;
        return await Movie.aggregate([
            { $match: filter },
            { $addFields: { randomOrder: { $rand: {} } } },
            { $sort: { randomOrder: 1 } },
            { $project: { randomOrder: 0 } }
        ]);
    },

    selectMoviesByGenres: async (genres, excludeIds, isKid = false) => {
        const objectIds = excludeIds.map(id => new mongoose.Types.ObjectId(id));
        const filter = { genres: { $in: genres }, _id: { $nin: objectIds } };
        if (isKid) filter.is_for_kids = true;
        return await Movie.aggregate([
            { $match: filter },
            { $addFields: { randomOrder: { $rand: {} } } },
            { $sort: { randomOrder: 1 } },
            { $project: { randomOrder: 0 } }
        ]);
    },

    selectMovieBySearch: async (search, isKid = false) => {
        const filter = { title: { $regex: `^${search}`, $options: 'i' } };
        if (isKid) filter.is_for_kids = true;
        return await Movie.aggregate([
            { $match: filter },
            { $addFields: { randomOrder: { $rand: {} } } },
            { $sort: { randomOrder: 1 } },
            { $project: { randomOrder: 0 } }
        ]);
    },

    selectMovieNames: async () => {
        return (
            await Movie.find({}, 'title _id')
        );
    }
}

module.exports = movieModel;