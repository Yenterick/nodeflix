const { User } = require('./userModel');
const { Profile } = require('./profileModel');
const { ViewEvent } = require('./viewEventModel');
const { ListEvent } = require('./listEventModel');
const { InteractionEvent } = require('./interactionEventModel');

// Configuring the 1:N relationship between user and profiles
User.hasMany(Profile, {
    foreignKey: {
        name: 'user_id',
    },
    as: 'profiles'
});

Profile.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
});

// Configuring the 1:N relationship between profile and view events
Profile.hasMany(ViewEvent, {
    foreignKey: {
        name: 'profile_id'
    },
    as: 'view_events'
})

ViewEvent.belongsTo(Profile, {
    foreignKey: {
        name: 'profile_id',
        allowNull: false
    }
});

// Configuring the 1:N relationship between profile and list events
Profile.hasMany(ListEvent, {
    foreignKey: {
        name: 'profile_id'
    },
    as: 'list_events'
});

ListEvent.belongsTo(Profile, {
    foreignKey: {
        name: 'profile_id',
        allowNull: false
    }
});

// Configuring the 1:N relationship between profile and interaction events
Profile.hasMany(InteractionEvent, {
    foreignKey: {
        name: 'profile_id'
    },
    as: 'interaction_events'
});

InteractionEvent.belongsTo(Profile, {
    foreignKey: {
        name: 'profile_id',
        allowNull: false
    }
});

module.exports = { User, Profile };