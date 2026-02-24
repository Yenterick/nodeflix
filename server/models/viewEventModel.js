const { DataTypes } = require('sequelize');

// Module imports
const { pgSequelize } = require('../config/database');

// Defines the view event model
const ViewEvent = pgSequelize.define(
    'ViewEvent',
    {},
    {
        tableName: 'view_events'
    }
);

// View event model with all the required functions
const viewEventModel = {

}

module.exports = viewEventModel;