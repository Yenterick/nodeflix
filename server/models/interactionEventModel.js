const { DataTypes } = require('sequelize');

// Module imports
const { pgSequelize } = require('../config/database');

// Defines the interaction event model
const InteractionEvent = pgSequelize.define('InteractionEvent', {
    interaction_event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false
    },
    interaction_type: {
        type: DataTypes.STRING(12),
        allowNull: false,
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
    tableName: 'interactions_events',
    timestamps: false
    }
);

const interactionEventModel = {
    insertInteractionEvent: async (interactionType, contentId, contentType, profileId) => {
        const createdInteractionEvent = await InteractionEvent.create({
            interaction_type: interactionType,
            content_id: contentId,
            content_type: contentType,
            profile_id: profileId
        });
        await createdInteractionEvent.save();
    },

    updateInteractionEventById: async (interactionEventId, interactionType) => {
        await InteractionEvent.update(
            {
                interactionType: interactionType
            },
            {
                where: {
                    interaction_event_id: interactionEventId
                }
            }
        );
    },

    deleteInteractionEventById: async (interactionEventId) => {
        await InteractionEvent.destroy(
            {
                where: {
                    interaction_event_id: interactionEventId
                }
            }
        )
    }
}

module.exports = { InteractionEvent, interactionEventModel };