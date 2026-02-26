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
    insertViewEvent: async (contentId, contentType, season, episode, watchedSeconds, completed, profileId) => {
        const createdViewEvent = await ViewEvent.create({
            content_id: contentId,
            content_type: contentType,
            season: season || null,
            episode: episode || null, 
            watched_seconds: watchedSeconds,
            completed: completed,
            profile_id: profileId
        });
        await createdViewEvent.save();
    },

    updateViewEvent: async (viewEventId, watchedSeconds, completed) => {
        await ViewEvent.update(
            {
                watched_seconds: watchedSeconds,
                completed: completed
            },
            {
                where: {
                    view_event_id: viewEventId
                }
            }
        );
    },

    deleteViewEvent: async (viewEventId) => {
        await ViewEvent.destroy(
            {
                where: {
                    view_event_id: viewEventId
                }
            }
        );
    }
}

module.exports = { ViewEvent, viewEventModel };