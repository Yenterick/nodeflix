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
    selectAllMovies : async () => {
        return (
            await Movie.find()
        );
    },
    
    selectMovieById : async (id) => {
        return (
            await Movie.find({ _id: ObjectId(id) })
        ); 
    },

    selectMoviesByGenre : async (genres) => { 
        return (
            await Movie.find({ 
                genres: {$all: genres} 
            })
        );
    },

    selectMovieBySearch : async (search) => {
        return (
            await Movie.find({ 
                $regex: `^${search}`, $options: 'i' 
            })
        );
    }
}

module.exports = movieModel;