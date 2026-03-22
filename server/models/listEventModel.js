const { DataTypes } = require('sequelize');

// Module imports
const { pgSequelize } = require('../config/database');

// Defines the list event model
const ListEvent = pgSequelize.define('ListEvent', {
    list_event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content_id: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    content_type: {
        type: DataTypes.STRING(12),
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
}, {
    tableName: 'list_events',
    timestamps: false
}
);

// List event model with all the required functions
const listEventModel = {
    insertListEvent: async (contentId, contentType, profileId) => {
        const createdListEvent = await ListEvent.create({
            content_id: contentId,
            content_type: contentType,
            profile_id: profileId
        });
        await createdListEvent.save();
    },

    deleteListEventBydId: async (listEventId) => {
        await ListEvent.destroy(
            {
                where: {
                    list_event_id: listEventId
                }
            }
        );
    },

    selectListEventByParams: async (contentId, contentType, profileId) => {
        return await ListEvent.findOne(
            {
                where: {
                    content_id: contentId,
                    content_type: contentType,
                    profile_id: profileId
                },
                include: [
                    {
                        association: 'profile',
                        required: true
                    }
                ]
            }
        );
    },

    deleteListEventByParams: async (contentId, contentType, profileId) => {
        await ListEvent.destroy(
            {
                where: {
                    content_id: contentId,
                    content_type: contentType,
                    profile_id: profileId
                }
            }
        );
    }
}

module.exports = { ListEvent, listEventModel };