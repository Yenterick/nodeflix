const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { getLogPrefix, log, sleep } = require('./utils/utils');
const { mongoConnection, pgConnection } = require('./config/database');

// TODO: Remove when implementing Dockerfile
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath, quiet: true });

const port = 5000;
const replicaApp = process.env.APP_NAME;
const app = express();

app.use(cors({origin: '*'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    try {
        res.status(200).json({ success: true, msg: 'Nodeflix server is up and healthy!'});
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
});

const startServer = async () => {
    await pgConnection();
    await mongoConnection();

    app.listen(port, () => {
        log(`${replicaApp} is listening on port ${port}`);
    });
}

startServer();

