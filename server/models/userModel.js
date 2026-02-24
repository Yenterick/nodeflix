const { DataTypes, Association } = require('sequelize');

// Module imports
const { pgSequelize } = require('../config/database');

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
        defaultValue: DataTypes.NOW
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
                where: {
                    email: email
                } 
            })
        );
    },

    deleteUserById: async (userId) => {
        return(
            User.destroy({
                where: {
                    user_id: userId
                }
            })
        )
    },

    selectUserProfiles: async (userId) => {
        return(User.findOne({
            where: {
                user_id: userId
            },
            include: [
                {
                    association: 'profiles'
                }
            ]
            }).profiles
        )
    }
}

module.exports = { User, userModel };
