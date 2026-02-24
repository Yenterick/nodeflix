const { DataTypes } = require('sequelize');

// Module imports
const { pgSequelize } = require('../config/database');

// Defines the profile model
const Profile = pgSequelize.define(
    'Profile',
    {},
    {
        tableName: 'profiles'
    }
);

// Profile model with all the required functions
const profileModel = {
    
}

module.exports = profileModel