const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const ProcessorService = require('./processorService');

// Importing the required models
const Movie = require('./models/movie');
const Series = require('./models/series');

// Environmental variables configuration
const envPath = path.join(app.getPath('userData'), '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

let mainWindow;

// Function to create a new browser window
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        icon: path.join(__dirname, '../public/assets/icon.ico'),
    });

    // Loading the content of the page
    mainWindow.loadFile(path.join(__dirname, './web/index.html'));
};

// Check to create the window when it's ready
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Closes the app if there are no windows
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Stores credentials temporarily for processing
let currentConfig = null;

// Tests if the mongo credentials are correct
ipcMain.handle('test-mongo', async (event, config) => {
    const { host, port, username, password, database } = config;
    const uri = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`;
    
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        currentConfig = { ...currentConfig, mongo: config };
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Tests if the ssh credentials are correct
ipcMain.handle('test-ssh', async (event, config) => {
    currentConfig = { ...currentConfig, ssh: config };
    return { success: true };
});

// Saves the credentials in the .env file
ipcMain.handle('save-credentials', async (event, config) => {
    const envContent = Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
    
    try {
        fs.writeFileSync(envPath, envContent);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Checks for existing credentials in the .env file
ipcMain.handle('get-credentials', async () => {
    if (!fs.existsSync(envPath)) return null;
    const content = fs.readFileSync(envPath, 'utf-8');
    const config = {};
    content.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) config[key] = value;
    });
    return config;
});

// Opens the select file window for video files and img files
ipcMain.handle('get-video-duration', async (event, filePath) => {
    const { spawn } = require('child_process');
    const ffmpegPath = require('ffmpeg-static');

    return new Promise((resolve) => {
        const ffmpeg = spawn(ffmpegPath, ['-i', filePath]);
        let output = '';

        ffmpeg.stderr.on('data', (data) => {
            output += data.toString();
        });

        ffmpeg.on('close', () => {
            const match = output.match(/Duration: (\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
            if (match) {
                const hours = parseInt(match[1]);
                const minutes = parseInt(match[2]);
                const seconds = parseInt(match[3]);
                const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
                resolve(totalSeconds);
            } else {
                resolve(null);
            }
        });
    });
});

ipcMain.handle('browse-file', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'Media', extensions: ['mp4', 'mkv', 'avi', 'jpg', 'jpeg', 'png'] },
            { name: 'Keys', extensions: ['pem', 'key', 'pub', '*'] }
        ]
    });
    if (result.canceled) return null;
    return result.filePaths[0];
});

// Media processor refactorized using the processorService
ipcMain.handle('process-media', async (event, data) => {
    // Prepares the environemnt
    const { type, metadata, files } = data;
    const processor = new ProcessorService(currentConfig.ssh);
    const tempDir = path.join(process.cwd(), 'temp-processing', Date.now().toString());

    try {
        // Movie check
        if (type === 'movie') {
            // Creates the id and the dir
            const movieId = new mongoose.Types.ObjectId();
            const outputDir = path.join(tempDir, 'movie');
            
            // Converts into hls (locally) and then sends the result files into the cdn
            event.sender.send('process-progress', 'Converting movie to HLS...');
            await processor.convertToHls(files.video, outputDir, (progress) => {
                event.sender.send('process-progress', `FFMPEG: ${progress.substring(0, 50)}...`);
            });

            event.sender.send('process-progress', 'Uploading Movie HLS segments...');
            const remotePath = `/var/www/hls/movies/${movieId}`;
            await processor.uploadFolder(outputDir, remotePath);

            event.sender.send('process-progress', 'Uploading Movie Thumbnail...');
            await processor.uploadFile(files.thumbnail, `${remotePath}/thumbnail.jpeg`);

            const movie = new Movie({
                ...metadata,
                _id: movieId,
                stream_url: `/movies/${movieId}/master.m3u8`,
                thumbnail_url: `/movies/${movieId}/thumbnail.jpeg`
            });
            await movie.save();

        // Series check
        } else if (type === 'series') {
            const seriesId = new mongoose.Types.ObjectId();
            const remoteBase = `/var/www/hls/series/${seriesId}`;
            
            // Converts into hls (locally) and then sends the result files into the cdn
            event.sender.send('process-progress', 'Uploading Series Thumbnail...');
            await processor.uploadFile(files.thumbnail, `${remoteBase}/thumbnail.jpeg`);

            // Recursivity adaptation to series creation
            for (const season of metadata.seasons) {
                for (const episode of season.episodes) {
                    const epKey = `s${season.number}e${episode.number}`;
                    const epFiles = files.episodes[epKey];
                    const epOutputDir = path.join(tempDir, epKey);
                    
                    event.sender.send('process-progress', `Converting S${season.number}E${episode.number}...`);
                    await processor.convertToHls(epFiles.video, epOutputDir);
                    await processor.extractThumbnail(epFiles.video, epOutputDir);

                    const remoteEpPath = `${remoteBase}/${season.number}/${episode.number}`;
                    await processor.uploadFolder(epOutputDir, remoteEpPath);

                    episode.stream_url = `/series/${seriesId}/${season.number}/${episode.number}/master.m3u8`;
                    episode.thumbnail_url = `/series/${seriesId}/${season.number}/${episode.number}/thumbnail.jpeg`;
                }
            }

            const series = new Series({
                ...metadata,
                _id: seriesId,
                thumbnail_url: `/series/${seriesId}/thumbnail.jpeg`
            });
            await series.save();
        }

        // Deletes the temporary directory to save space
        await processor.cleanup(tempDir);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// TODO: Update documentation 
// TODO: Implement profile pics