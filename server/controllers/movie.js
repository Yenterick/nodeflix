const movieModel = require('../models/movieModel');

// Searches movies by title and/or genre
const searchMovies = async (req, res) => {
    try {
        const isKid = req.params.kidCheck === 'kid';
        const { q, genre } = req.query;

        let movies;
        if (q && q.trim() !== '') {
            movies = await movieModel.selectMovieBySearch(q.trim(), isKid);
        } else if (genre && genre !== 'All') {
            movies = await movieModel.selectMoviesByGenresPrecise([genre], isKid);
        } else {
            movies = await movieModel.selectAllMovies(isKid);
        }

        // If genre filter is applied alongside a text search, filter client-side
        if (q && q.trim() !== '' && genre && genre !== 'All') {
            movies = movies.filter(m => m.genres && m.genres.includes(genre));
        }

        res.status(200).json({ success: true, msg: 'Movies search results retrieved.', data: movies });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Selects all the movies
// Accepts optional `kidCheck` boolean in the request params
const getAllMovies = async (req, res) => {
    try {
        const isKid = req.params.kidCheck === 'kid';
        const movies = await movieModel.selectAllMovies(isKid);
        res.status(200).json({ success: true, msg: 'Movies successfully retrieved.', data: movies });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Selects a movie
const getMovie = async (req, res) => {
    try {
        const { movieId } = req.params

        const movie = await movieModel.selectMovieById(movieId);
        res.status(200).json({ success: true, msg: 'Movie successfully retrieved', data: movie });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

const getMovieNames = async (req, res) => {
    try {
        const movies = await movieModel.selectMovieNames();
        res.status(200).json({ success: true, msg: 'Movie names and IDs successfully retrieved.', data: movies });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

module.exports = {
    getAllMovies,
    getMovie,
    getMovieNames,
    searchMovies
}