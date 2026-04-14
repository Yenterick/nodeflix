const mongoose = require('mongoose');

const profilePictureSchema = new mongoose.Schema({
    content_name: String,
    pictures: [String],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProfilePicture', profilePictureSchema, 'profile_pictures');
