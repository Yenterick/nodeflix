const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

const envPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`

const dbConnection = async () => {
    try {
        await mongoose.connect(uri)
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = { dbConnection }