const { User } = require('./userModel');
const { Profile } = require('./profileModel');
const { ViewEvent } = require('./viewEventModel');

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
})

module.exports = { User, Profile };