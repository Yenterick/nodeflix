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

module.exports = mongoose.model('Movie', movieSchema);