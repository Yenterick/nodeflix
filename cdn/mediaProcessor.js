const readline = require('readline');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const { Client } = require('ssh2')
const { readFileSync } = require('fs');

const { dbConnection } = require('./config/database');
const Movie = require('./models/movie');
const Series = require('./models/series');

const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath, quiet: true });

const sysArgs = process.argv.slice(2);

const getLogPrefix = () => {
    const now = new Date();
    const timeStamp = now.toLocaleString();
    return `[nodeflix-cdn@1.0.0 | ${timeStamp}] - `;
}

const log = (message) => {
    console.log(`${getLogPrefix()}${message}`);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(`${getLogPrefix() + question}`, (answer) => {
            resolve(answer);
        });
    });
};

const movieForm = async (paths) => {
    log('Please fill the following movie information:');
    const title = await askQuestion('Title: ');
    const description = await askQuestion('Description: ');
    const genresRaw = await askQuestion('Genres (comma separated): ');
    const castRaw = await askQuestion('Cast (comma separated): ');
    const releaseYear = await askQuestion('Release Year: ');
    const duration = await askQuestion('Duration (seconds): ');
    const isForKids = await askQuestion('Is it for kids? (y/n): ');

    const movieData = {
        title,
        description,
        genres: genresRaw.split(',').map(g => g.trim()),
        cast: castRaw.split(',').map(c => c.trim()),
        releaseYear: parseInt(releaseYear),
        duration: parseInt(duration),
        is_for_kids: isForKids.toLowerCase() === 'y',
        thumbnail_url: paths.thumbnailPath,
        stream_url: paths.inputPath
    };

    return movieData;
}

const stdFlag = () => {
    if (sysArgs.includes('--v') || sysArgs.includes('-v') || sysArgs.includes('--version') || sysArgs.includes('-version')) {
        console.log('v1.0.0');
        process.exit(0);
    } else if (sysArgs.includes('--h') || sysArgs.includes('-h') || sysArgs.includes('--help') || sysArgs.includes('-help')) {
        console.log('Usage: node mediaProcessor.js [options]');
        console.log('Options:');
        console.log('   --v, --version    Show version');
        console.log('   --h, --help       Show this help message');
        console.log('   --m, --movie      Process a movie');
        console.log('   --s, --series     Process a series');
        console.log('   --l, --local      Process local media');
        console.log('   --r, --remote     Process remote media');
        console.log('   Movie Process:');
        console.log('       --i, --input      Input file path');
        console.log('       --t, --thumbnail  Thumbnail file path');
        console.log('   Series Process:');
        // TODO: Make the series help section
        console.log('       (WIP)')
        process.exit(0);
    }
}

const contentFlag = () => {
    if (sysArgs.includes('--m') || sysArgs.includes('-m') || sysArgs.includes('--movie') || sysArgs.includes('-movie')) {
        log('You are going to append a movie to the database...');
        return ('movie');
    } else if (sysArgs.includes('--s') || sysArgs.includes('-s') || sysArgs.includes('--series') || sysArgs.includes('-series')) {
        log('You are going to append a series to the database...');
        return ('series');
    } else {
        log("You need to select a media type with '--m' or '--s'! ('--h' for help).");
        process.exit(1);
    }
}

const environmentFlag = () => {
    if (sysArgs.includes('--l') || sysArgs.includes('-l') || sysArgs.includes('--local') || sysArgs.includes('-local')) {
        log('You are going to process local media...');
        return ('local');
    } else if (sysArgs.includes('--r') || sysArgs.includes('-r') || sysArgs.includes('--remote') || sysArgs.includes('-remote')) {
        log('You are going to process remote media...');
        return ('remote');
    } else {
        log("You need to select an env type with '--l' or '--r'! ('--h' for help).");
        process.exit(1);
    }
}

const moviePathsFlag = () => {
    const inputIdx = sysArgs.findIndex(arg => ['--i', '-i', '--input', '-input'].includes(arg));
    const thumbnailIdx = sysArgs.findIndex(arg => ['--t', '-t', '--thumbnail', '-thumbnail'].includes(arg));
    const inputPath = inputIdx !== -1 ? sysArgs[inputIdx + 1] : null;
    const thumbnailPath = thumbnailIdx !== -1 ? sysArgs[thumbnailIdx + 1] : null;

    if (!inputPath || !thumbnailPath) {
        log("You need to specify both the input path and thumbnail path with (--i [input path] --t [thumbnail path])!");
        process.exit(1);
    }

    log(`You are going to process ${inputPath}...`);
    log(`You are going to process ${thumbnailPath}...`);
    return { inputPath, thumbnailPath };
}

const remoteProcess = async (movieId, inputPath, thumbnailPath) => {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        conn.on('ready', () => {
            log('SSH client connected successfully...');

            const movieDir = `/var/www/hls/movies/${movieId}`;
            const hlsCommand = `ffmpeg -i "/var/www/uploads/${inputPath}" -hls_time 10 -hls_list_size 0 -hls_segment_filename "${movieDir}/segment_%03d.ts" -f hls "${movieDir}/master.m3u8"`;
            const thumbnailCommand = `ffmpeg -i "/var/www/uploads/${thumbnailPath}" -vframes 1 -q:v 2 "${movieDir}/thumbnail.jpeg"`;

            const fullCommand = `mkdir -p ${movieDir} && ${hlsCommand} && ${thumbnailCommand}`;
            
            log(`Executing: ${fullCommand}`);

            conn.exec(fullCommand, (error, stream) => {
                if (error) reject(error);
                stream.on('close', (code, signal) => {
                    conn.end();
                    log(`Stream finished | Code : ${code} | Signal : ${signal}.`);
                    resolve();
                }).on('data', (data) => {
                    log(`<${process.env.SSH_USERNAME}@${process.env.SSH_HOST}:${process.env.SSH_PORT}> ${data}`);
                }).stderr.on('data', (data) => {
                    reject(data)
                });
            });
        }).connect({
            host: process.env.SSH_HOST,
            port: process.env.SSH_PORT,
            username: process.env.SSH_USERNAME,
            privateKey: readFileSync(process.env.EPUB_KEY_PATH)
        });
    });
}

const localProcess = async () => {
    // TODO: Make the local media process.
}

const processMedia = async () => {
    stdFlag();
    const contentType = contentFlag();
    const environment = environmentFlag();
    const moviePaths = moviePathsFlag();

    log('Connecting to the database, please wait...');
    try {
        await dbConnection();
        log('Database connected successfully.')
    } catch (error) {
        log(error + '.');
        process.exit(1);
    }

    if (contentType === 'movie') {
        var movieId;
        try {
            const movie = new Movie(await movieForm(moviePaths));
            movieId = movie._id;
            movie.stream_url = `/movies/${movieId}/master.m3u8`;
            movie.thumbnail_url = `/movies/${movieId}/thumbnail.jpeg`;
            log('Movie object created successfully!');
            log(movie);
            await movie.save();
        } catch (error) {
            log(error + '.');
            process.exit(1);
        }
    }

    if (environment === 'remote') {
        log('Connecting to the SSH client, please wait...');
        try {
            await remoteProcess(movieId, moviePaths.inputPath, moviePaths.thumbnailPath);
        } catch (error) {
            log(error + '.');
            process.exit(1);
        }
    }

    rl.close();
    mongoose.connection.close();
    process.exit(0);
}

processMedia();
