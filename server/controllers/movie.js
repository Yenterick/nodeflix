const movieModel = require('../models/movieModel');

const getAllMovies = async (req, res) => {
    try {
        const movies = await movielModel.getAllMovies();
        res.status(200).json({ success: true, msg: 'Movies successfully retrieved.', data:  movies });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

const getMovie = async (req, res) => {
    try {
        const { movieId } = req.params

        const movie = await movieModel.selectMovieById(movieId);
        res.status(200).json({ success: true, msg: 'Movie successfully retrieved', data: movie });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

module.exports = {
    getAllMovies,
    getMovie
}