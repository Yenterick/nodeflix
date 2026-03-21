const { DataTypes } = require('sequelize');

// Module imports
const { pgSequelize } = require('../config/database');

// Defines the list event model
const ListEvent = pgSequelize.define('ListEvent', {
    list_event_id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        autoIncrement: true
    },
    content_id: {
        type: DataTypes.STRING(32),
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
    }}, {
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
    }
}

module.exports = { ListEvent, listEventModel };