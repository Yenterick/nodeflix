const movieModel = require('../models/movieModel');

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
    getMovieNames
}