const { app, BrowserWindow, ipcMain, dialog } = require('electron');
app.name = 'nodeflix-cdn-app';
const nativeImage = require('electron').nativeImage;
const path = require('path');

// Ensure userData directory matches the correct app directory in testing
const currentUserData = app.getPath('userData');
if (currentUserData.endsWith('Electron')) {
    app.setPath('userData', path.join(app.getPath('appData'), 'nodeflix-cdn-app'));
}
const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const ProcessorService = require('./processorService');

// Importing the required models
const Movie = require('./models/movie');
const Series = require('./models/series');
const ProfilePicture = require('./models/profilePicture');

// Environmental variables configuration
const envPath = path.join(app.getPath('userData'), '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, quiet: true });
}

let mainWindow;

// Function to create a new browser window
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 900,
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

    // Disabling the menu bar
    mainWindow.setMenuBarVisibility(false);
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
    const SftpClient = require('ssh2-sftp-client');

    try {
        if (!fs.existsSync(config.keyPath)) {
            return { success: false, error: 'Key file not found at the specified path.' };
        }

        const keyContent = fs.readFileSync(config.keyPath, 'utf8').trim();

        if (keyContent.includes('PUBLIC KEY')) {
            return { success: false, error: 'You selected a public key (.pub). Please select the private key instead.' };
        }

        const validHeaders = [
            '-----BEGIN OPENSSH PRIVATE KEY-----',
            '-----BEGIN RSA PRIVATE KEY-----',
            '-----BEGIN DSA PRIVATE KEY-----',
            '-----BEGIN EC PRIVATE KEY-----',
            '-----BEGIN PRIVATE KEY-----'
        ];

        const isValid = validHeaders.some(header => keyContent.startsWith(header));
        if (!isValid) {
            return { success: false, error: 'The file does not contain a valid private key.' };
        }

        // Checks the ssh  connection
        const sftp = new SftpClient();
        await sftp.connect({
            host: config.host,
            port: parseInt(config.port),
            username: config.username,
            privateKey: keyContent,
            readyTimeout: 5000
        });
        await sftp.end();

        currentConfig = { ...currentConfig, ssh: config };
        return { success: true };
    } catch (error) {
        return { success: false, error: `SSH Connection Failed: ${error.message}` };
    }
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
    let ffmpegPath = require('ffmpeg-static');
    ffmpegPath = ffmpegPath.replace('app.asar', 'app.asar.unpacked');

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
    const tempDir = path.join(app.getPath('temp'), 'nodeflix-processing', Date.now().toString());

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
                    const epKey = `s${season.season_number}e${episode.episode_number}`;
                    const epFiles = files.episodes[epKey];
                    const epOutputDir = path.join(tempDir, epKey);

                    event.sender.send('process-progress', `Converting S${season.season_number}E${episode.episode_number}...`);
                    await processor.convertToHls(epFiles.video, epOutputDir);
                    await processor.extractThumbnail(epFiles.video, epOutputDir);

                    const remoteEpPath = `${remoteBase}/${season.season_number}/${episode.episode_number}`;
                    await processor.uploadFolder(epOutputDir, remoteEpPath);

                    episode.stream_url = `/series/${seriesId}/${season.season_number}/${episode.episode_number}/master.m3u8`;
                    episode.thumbnail_url = `/series/${seriesId}/${season.season_number}/${episode.episode_number}/thumbnail.jpeg`;
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

// Returns all movies and series for the pictures selector
ipcMain.handle('get-all-content', async () => {
    try {
        const movies = await Movie.find({}).select('title').sort({ title: 1 });
        const series = await Series.find({}).select('title').sort({ title: 1 });
        return {
            success: true,
            movies: movies.map(m => m.title),
            series: series.map(s => s.title)
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Processes and uploads profile pictures to the CDN
ipcMain.handle('process-pictures', async (event, data) => {
    const { contentName, imagePaths } = data;
    const processor = new ProcessorService(currentConfig.ssh);
    const pictureId = new mongoose.Types.ObjectId();
    const tempDir = path.join(app.getPath('temp'), 'nodeflix-processing', Date.now().toString());

    try {
        const remotePictures = [];

        for (let i = 0; i < imagePaths.length; i++) {
            const fileName = `${i + 1}.jpeg`;
            const tempOutput = path.join(tempDir, fileName);

            event.sender.send('process-progress', `Converting image ${i + 1}/${imagePaths.length}...`);
            await processor.convertImage(imagePaths[i], tempOutput);

            const remotePath = `/var/www/hls/pictures/${pictureId}/${fileName}`;
            event.sender.send('process-progress', `Uploading image ${i + 1}/${imagePaths.length}...`);
            await processor.uploadFile(tempOutput, remotePath);

            remotePictures.push(`/pictures/${pictureId}/${fileName}`);
        }

        const entry = new ProfilePicture({
            _id: pictureId,
            content_name: contentName,
            pictures: remotePictures
        });
        await entry.save();

        await processor.cleanup(tempDir);
        return { success: true };
    } catch (error) {
        await processor.cleanup(tempDir).catch(() => {});
        return { success: false, error: error.message };
    }
});

// IPC Handlers for Edit and Delete functionality

ipcMain.handle('get-manage-movies', async () => {
    try {
        const movies = await Movie.find({}).sort({ title: 1 }).lean();
        const serialized = movies.map(m => ({
            ...m,
            _id: m._id.toString()
        }));
        return { success: true, data: serialized };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('get-manage-series', async () => {
    try {
        const series = await Series.find({}).sort({ title: 1 }).lean();
        const serialized = series.map(s => ({
            ...s,
            _id: s._id.toString()
        }));
        return { success: true, data: serialized };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('get-manage-pictures', async () => {
    try {
        const pictures = await ProfilePicture.find({}).sort({ content_name: 1 }).lean();
        const serialized = pictures.map(p => ({
            ...p,
            _id: p._id.toString()
        }));
        return { success: true, data: serialized };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('update-movie', async (event, { id, metadata }) => {
    try {
        await Movie.findByIdAndUpdate(id, metadata);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('update-series', async (event, { id, metadata }) => {
    try {
        await Series.findByIdAndUpdate(id, metadata);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('update-picture', async (event, { id, metadata }) => {
    try {
        await ProfilePicture.findByIdAndUpdate(id, metadata);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('delete-movie', async (event, id) => {
    try {
        const movie = await Movie.findById(id);
        if (!movie) {
            return { success: false, error: 'Movie not found' };
        }
        await Movie.findByIdAndDelete(id);

        const processor = new ProcessorService(currentConfig.ssh);
        const remotePath = `/var/www/hls/movies/${id}`;
        await processor.deleteRemoteFolder(remotePath);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('delete-series', async (event, id) => {
    try {
        const series = await Series.findById(id);
        if (!series) {
            return { success: false, error: 'Series not found' };
        }
        await Series.findByIdAndDelete(id);

        const processor = new ProcessorService(currentConfig.ssh);
        const remotePath = `/var/www/hls/series/${id}`;
        await processor.deleteRemoteFolder(remotePath);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('delete-picture', async (event, id) => {
    try {
        const picture = await ProfilePicture.findById(id);
        if (!picture) {
            return { success: false, error: 'Profile pictures not found' };
        }
        await ProfilePicture.findByIdAndDelete(id);

        const processor = new ProcessorService(currentConfig.ssh);
        const remotePath = `/var/www/hls/pictures/${id}`;
        await processor.deleteRemoteFolder(remotePath);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});