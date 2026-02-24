const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

// Modules import
const { getLogPrefix, log, sleep} = require('../utils/utils');

//TODO: Remove when implementing Dockerfile
const envPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath, quiet: true });

// Preparing the connection URLs for the databases
const mongoUri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;
const pgUri = `postgres://${process.env.PG_USERNAME}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`;

// Function to connect to MongoDB
const mongoConnection = async () => {
    log('Connecting to Mongo...');
    let connected = false;
    while (!connected) {
        try {
            await mongoose.connect(mongoUri);
            log('Mongo successfully connected.');
            connected = true;
        } catch (error) {
            // Loops till the database is successfully connected
            log(`Mongo got an error while trying to connect: ${error} - Retrying in 5 seconds...`);
            await sleep(5000);
        }
    }
}

// Creating the Postgres sequelize object
const pgSequelize = new Sequelize(pgUri, { logging: false });

// Function to connect to Postgres
const pgConnection = async () => {
    log('Connecting to Postgres...');
    let connected = false;
    while (!connected) {
        try {
            await pgSequelize.authenticate();
            log('Postgres successfully connected.');
            connected = true;
        } catch (error) {
            // Loops till the database is successfully connected
            log(`Postgres got an error while trying to connect: ${error} - Retrying in 5 seconds...`);
            await sleep(5000);
        }
    }
}

module.exports = { mongoConnection, pgConnection, pgSequelize }