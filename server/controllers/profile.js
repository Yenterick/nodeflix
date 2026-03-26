// Module imports
const { profileModel } = require('../models/profileModel');

// Creates a new profile
const createProfile = async (req, res) => {
    try {
        const { name, profilePic, isKid, userId } = req.body;
        if (!name || !name.trim()) return res.status(400).json({ success: false, msg: 'Data missing.' });
        const createdProfile = await profileModel.insertProfile(name, profilePic, isKid, userId);

        res.status(201).json({ success: true, msg: 'Profile successfully created.', data: createdProfile});
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Deletes a profile
const deleteProfile = async (req, res) => {
    try {
        const { profileId } = req.params;
        await profileModel.deleteProfileById(profileId);

        res.status(200).json({ success: true, msg: 'Profile successfully deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Updates a profile
const updateProfile = async (req, res) => {
    try{
        const { profileId } = req.params;
        const { name, profilePic, isKid } = req.body;
        if (!name || !name.trim()) return res.status(400).json({ success: false, msg: 'Data missing.' });
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

