const { DataTypes } = require('sequelize');

// Module imports
const { pgSequelize } = require('../config/database');

// Defines the profile model
const Profile = pgSequelize.define('Profile', {
    profile_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    profile_pic: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    is_kid : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    }, {
    tableName: 'profiles',
    timestamps: false
    }
);

// Profile model with all the required functions
const profileModel = {
    insertProfile: async (name, profilePic, isKid, userId) => {
        const createdProfile = await Profile.create({
            name: name,
            profile_pic: profilePic || '/pics/default/1.jpeg',
            is_kid: isKid,
            user_id: userId
        });

        await createdProfile.save();
    },

    selectProfileById: async (profileId) => {
        return(
           await Profile.findByPk(profileId)
        );
    },

    deleteProfileById: async (profileId) => {
        return(
            await Profile.destroy({
                where: {
                    profile_id: profileId
                }
            })
        )
    },

    updateProfileById: async (profileId, name, profilePic, isKid) => {
        await Profile.update(
            {
                name: name,
                profile_pic: profilePic,
                is_kid: isKid
            },
            {
                where: {
                    profile_id: profileId
                }
            }
        )
    },

    selectProfileViewEvents: async (profileId) => {
        const profile = await Profile.findByPk(profileId,
            {
                include: [
                    {
                        association: 'view_events',
                        required: true
                    }
                ]
            }
        )

        return profile?.view_events || [];
    }
}

module.exports = { Profile, profileModel }