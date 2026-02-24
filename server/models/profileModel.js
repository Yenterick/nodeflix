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
        allowNull: false,
        defaultValue: '/pics/default/1.jpeg'
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
            profilePic: profilePic || null,
            isKid: isKid,
            userId: userId
        });

        await createdProfile.save();
    },

    selectProfileById: async (profileId) => {
        return(
            Profile.findOne({
                where: {
                    profile_id: profileId
                }
            })
        );
    },

    deleteProfileById: async (profileId) => {
        return(
            Profile.destroy({
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
    }
}

module.exports = { Profile, profileModel }