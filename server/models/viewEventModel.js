const { DataTypes } = require('sequelize');

// Module imports
const { pgSequelize } = require('../config/database');

// Defines the view event model
const ViewEvent = pgSequelize.define('ViewEvent', {
    view_event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content_type: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    season: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    episode: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    watched_seconds: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }},
    {
        tableName: 'view_events',
        timestamps: false
    }
);

// View event model with all the required functions
const viewEventModel = {

}

module.exports = { ViewEvent, viewEventModel };