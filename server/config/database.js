const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const { Pool } = require('pg');
const { getLogPrefix, log, sleep} = require('../utils/utils');

//TODO: Remove when implementing Dockerfile
const envPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath, quiet: true });

const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`

const mongoConnection = async () => {
    log('Connecting to Mongo...');
    let connected = false;
    while (!connected) {
        try {
            await mongoose.connect(uri);
            log('Mongo successfully connected.');
            connected = true;
        } catch (error) {
            log(`Mongo got an error while trying to connect: ${error} - Retrying in 5 seconds...`);
            await sleep(5000);
        }
    }
}

const pgPool = new Pool({
    connectionString: `postgres://${process.env.PG_USERNAME}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`
});

const pgConnection = async () => {
    log('Connecting to Postgres...');
    let connected = false;
    while (!connected) {
        try {
            await pgPool.connect();
            log('Postgres successfully connected.');
            connected = true;
        } catch (error) {
            log(`Postgres got an error while trying to connect: ${error} - Retrying in 5 seconds...`);
            await sleep(5000);
        }
    }
}

module.exports = { mongoConnection, pgConnection, pgPool }