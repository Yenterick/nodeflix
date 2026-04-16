const mongoose = require('mongoose');

// Creates the mongoose profile pictures Schema
const profilePictureSchema = new mongoose.Schema({
    content_name: String,
    pictures: [String],
    created_at: { type: Date, default: Date.now }
});

// Converts the profile pictures schema into a model
const ProfilePicture = mongoose.model('ProfilePicture', profilePictureSchema, 'profile_pictures');

// Profile pictures model with all the required functions 
const profilePictureModel = {
    selectAllProfilePictures : async () => {
        return (
            await ProfilePicture.find()
        );
    }
}

module.exports = profilePictureModel;