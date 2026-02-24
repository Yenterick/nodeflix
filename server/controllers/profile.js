// Module imports
const { profileModel } = require('../models/profileModel');

// Create a new profile
const createProfile = async (req, res) => {
    try {
        const { name, profilePic, isKid, userId } = req.body;
        await profileModel.insertProfile(name, profilePic, isKid, userId);

        res.status(201).json({ success: true, msg: 'Profile successfully created.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Delete a profile
const deleteProfile = async (req, res) => {
    try {
        const { profileId } = req.params;
        await profileModel.deleteProfileById(profileId);

        res.status(200).json({ success: true, msg: 'Profile successfully deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Update a profile
const updateProfile = async (req, res) => {
    try{
        const { profileId } = req.params;
        const { name, profilePic, isKid } = req.body;
        await profileModel.updateProfileById(profileId, name, profilePic, isKid);

        res.status(200).json({ success: true, msg: 'Profile successfully updated.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

module.exports = {
    createProfile,
    deleteProfile,
    updateProfile
}

