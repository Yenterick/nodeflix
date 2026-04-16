const profilePictureModel = require('../models/profilePictureModel');

// Selects all the profile pictures
const getAllProfilePictures = async (req, res) => {
    try {
        const profilePictures = await profilePictureModel.selectAllProfilePictures();

        res.status(200).json({ success: true, msg: 'Profile pictures successfully retrieved.', data: profilePictures });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

module.exports = {
    getAllProfilePictures
}