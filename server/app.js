const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Module imports
const { getLogPrefix, log, sleep } = require('./utils/utils');
const { mongoConnection, pgConnection } = require('./config/database');

// Associations config
require('./models/associations');

// Routers imports
const userRouter = require('./routes/user');
const profileRouter = require('./routes/profile');
const movieRouter = require('./routes/movie');
const seriesRouter = require('./routes/series');

// TODO: Remove when implementing Dockerfile
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath, quiet: true });

// Previous variable declarations
const port = 5000;
const replicaApp = process.env.APP_NAME;
const app = express();

// Previous app configuration
// TODO: Change cors origins before deploying
app.use(cors({origin: '*'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers configuration
app.use('/api/user', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/movie', movieRouter);
app.use('/api/series', seriesRouter);

// Server health check
app.get('/health', (req, res) => {
    try {
        res.status(200).json({ success: true, msg: 'Nodeflix server is up and healthy!'});
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message })
    }
});

// Main function to connect the databases and run the server
const startServer = async () => {
    await pgConnection();
    await mongoConnection();

    app.listen(port, () => {
        log(`${replicaApp} is listening on port ${port}`);
    });
}

startServer();

