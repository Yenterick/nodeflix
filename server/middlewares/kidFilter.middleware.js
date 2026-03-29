// Module imports
const { profileModel } = require('../models/profileModel');

// Resolves the active profile and injects req.isKid
// Reads profileId from req.params or req.query
module.exports = async (req, res, next) => {
    try {
        const profileId = req.params.profileId || req.query.profileId || req.body.profileId;

        if (!profileId) {
            req.isKid = false;
            return next();
        }

        const profile = await profileModel.selectProfileById(profileId);
        req.isKid = profile?.is_kid ?? false;
        next();
    } catch (error) {
        req.isKid = false;
        next();
    }
};
