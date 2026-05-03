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
        type: DataTypes.STRING(64),
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
    }
},
    {
        tableName: 'view_events',
        timestamps: false
    }
);

// View event model with all the required functions
const viewEventModel = {
    selectAllViewEvents: async () => {
        return await ViewEvent.findAll();
    },

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

    updateViewEventById: async (viewEventId, watchedSeconds, completed) => {
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

    deleteViewEventById: async (viewEventId) => {
        await ViewEvent.destroy(
            {
                where: {
                    view_event_id: viewEventId
                }
            }
        );
    },

    selectViewEventByParams: async (contentId, contentType, profileId) => {
        return await ViewEvent.findOne(
            {
                where: {
                    content_id: contentId,
                    content_type: contentType,
                    profile_id: profileId
                },
                order: [
                    ['season', 'DESC'],
                    ['episode', 'DESC'],
                    ['created_at', 'DESC']
                ],
                include: [
                    {
                        association: 'profile',
                        required: true
                    }
                ]
            }
        );
    },

    deleteViewEventByParams: async (contentId, contentType, profileId) => {
        await ViewEvent.destroy(
            {
                where: {
                    content_id: contentId,
                    content_type: contentType,
                    profile_id: profileId
                }
            }
        );
    },

    updateViewEventByParams: async (contentId, contentType, profileId, watchedSeconds, completed, season, episode) => {
        await ViewEvent.update(
            {
                watched_seconds: watchedSeconds,
                completed: completed,
                season: season || null,
                episode: episode || null
            },
            {
                where: {
                    content_id: contentId,
                    content_type: contentType,
                    profile_id: profileId
                }
            }
        );
    },

    selectTopViewEvents: async (limit = 10) => {
        return await ViewEvent.findAll({
            attributes: [
                'content_id',
                'content_type',
                [pgSequelize.fn('COUNT', pgSequelize.col('content_id')), 'view_count']
            ],
            group: ['content_id', 'content_type'],
            order: [[pgSequelize.fn('COUNT', pgSequelize.col('content_id')), 'DESC']],
            limit: limit
        });
    }
}

module.exports = { ViewEvent, viewEventModel };