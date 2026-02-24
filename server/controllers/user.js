const bcrypt = require('bcrypt');

// Modules import
const { userModel } = require('../models/userModel');
const { generateToken } = require('../config/jwt');

// Configuring the salt rounds to encrypt the passwords
const saltRounds = 3;

// Registers a new user
const registerUser = async (req, res) => {
    try {
        const { email, password, screens } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await userModel.insertUser(email, hashedPassword, screens);
        res.status(201).json({ success: true, msg: 'User successfully created.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Logs in an existing user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.selectUserByEmail(email);

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) return res.status(401).json({ success: false, msg: "Incorrect password." });

        const token = generateToken(user);
        res.status(200).json({ success: true, msg: 'Logged successfully.', token, id: user.user_id, screens: user.screens });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Delets an user
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await userModel.deleteUserById(userId);

        res.status(200).json({ success: true, msg: 'User successfully deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

// Gets the user's profiles
const getUserProfiles = async (req, res) => {
    try {
        const { userId } = req.body;
        const profiles = await userModel.selectUserProfiles(userId);
        
        res.status(200).json({ success: true, msg: 'Profiles successfully retrieved.', data: profiles });

    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    deleteUser,
    getUserProfiles
}

