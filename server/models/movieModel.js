const mongoose = require('mongoose');

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

const Movie = mongoose.model('Movie', movieSchema);
const movieModel = {
    selectAllMovies: async () => {
        return (await Movie.find());
    },

    selectMoviesByGenre: async (genres) => { 
        return (await Movie.find({ genres: {$all: genres} }));
    },

    selectMovieBySearch: async (search) => {
        return (await Movie.find({ $regex: `^${search}`, $options: 'i' }));
    }
}

module.exports = movieModel;