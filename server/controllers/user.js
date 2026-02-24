const userModel = require('../models/userModel');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcrypt');

const saltRounds = 3;

const registerUser = async (req, res) => {
    try {
        const { email, password, screens } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await userModel.insertUser(email, hashedPassword, screens);
        res.status(201).json({ success: true, msg: "User successfully created" });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.selectUserByEmail(email);

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) return res.status(401).json({ success: false, msg: "Incorrect password" });

        const token = generateToken(user);
        res.status(200).json({ success: true, msg: "Logged successfully", token, id: user.user_id, screens: user.screens });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser
}

