const { DataTypes } = require('sequelize');

// Module imports
const { pgConnection, pgSequelize } = require('../config/database');

// Defines the user model
const User = pgSequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    screens: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now()
    }}, {
    tableName: 'users',
    timestamps: false
    }
);

// User model with all the required functions
const userModel = {
    insertUser : async (email, password, screens) => {
        const createdUser = await User.create({ 
            email: email,
            password: password,
            screens: screens
        });
        await createdUser.save();
    },

    selectUserByEmail: async (email) => {
        return(
            User.findOne({
                 where: { email: email } 
                })
        );
    },

}

module.exports = userModel;
