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
    selectAllMovies : async (isKid = false) => {
        const filter = isKid ? { is_for_kids: true } : {};
        return (
            await Movie.find(filter)
        );
    },
    
    selectMovieById : async (id) => {
        return (
            await Movie.findById(id)
        ); 
    },

    selectMoviesByGenresPrecise : async (genres, isKid = false) => { 
        const filter = { genres: { $all: genres } };
        if (isKid) filter.is_for_kids = true;
        return (
            await Movie.find(filter)
        );
    },

    selectMoviesByGenres : async (genres, excludeIds, isKid = false) => { 
        const filter = { genres: { $in: genres }, _id: { $nin: excludeIds } };
        if (isKid) filter.is_for_kids = true;
        return (
            await Movie.find(filter)
        );
    },

    selectMovieBySearch : async (search, isKid = false) => {
        const filter = { title: { $regex: `^${search}`, $options: 'i' } };
        if (isKid) filter.is_for_kids = true;
        return (
            await Movie.find(filter)
        );
    },

    selectMovieNames : async () => {
        return (
            await Movie.find({}, 'title _id')
        );
    }
}

module.exports = movieModel;