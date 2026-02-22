const readline = require('readline');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const { Client } = require('ssh2')
const { readFileSync } = require('fs');

// Importing the database and required models
const { dbConnection } = require('./config/database');
const Movie = require('./models/movie');
const Series = require('./models/series');

// Configuring the .env variables
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath, quiet: true });

// Retrieving the command flags
const sysArgs = process.argv.slice(2);

// Gets a prefix with the actual time to log info
const getLogPrefix = () => {
    const now = new Date();
    const timeStamp = now.toLocaleString();
    return `[nodeflix-cdn@1.0.0 | ${timeStamp}] - `;
}

// Logs info in the terminal
const log = (message) => {
    console.log(`${getLogPrefix()}${message}`);
}

// Configuring the readline interface to retrieve info from the terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Retrieves info from the terminal
const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(`${getLogPrefix() + question}`, (answer) => {
            resolve(answer);
        });
    });
};

// Asks for the info needed to model a movie
const movieForm = async () => {
    log('Please fill the following movie information:');
    const title = await askQuestion('Title: ');
    const description = await askQuestion('Description: ');
    const genresRaw = await askQuestion('Genres (A, B, C): ');
    const castRaw = await askQuestion('Cast (A, B, C): ');
    const releaseYear = await askQuestion('Release Year: ');
    const duration = await askQuestion('Duration (seconds): ');
    const isForKids = await askQuestion('Is it for kids? [y/N]: ');

    const movieData = {
        title,
        description,
        genres: genresRaw.split(',').map(g => g.trim()),
        cast: castRaw.split(',').map(c => c.trim()),
        releaseYear: parseInt(releaseYear),
        duration: parseInt(duration),
        is_for_kids: isForKids.toLowerCase() === 'y'
    };

    return movieData;
}

// Asks for the info needed to model a series
const seriesForm = async () => {
    log('Please fill the following series information:');
    const title = await askQuestion('Title: ');
    const description = await askQuestion('Description: ');
    const genresRaw = await askQuestion('Genres (A, B, C): ');
    const castRaw = await askQuestion('Cast (A, B, C): ');
    const releaseYear = await askQuestion('Release Year: ');
    const isForKids = await askQuestion('Is it for kids? [y/N]: ');

    const seasons = [];
    let seasonNumber = 1;

    // Loops if the user wants to add more seasons
    while (true) {
        const addSeason = await askQuestion(`Do you want to add season ${seasonNumber}? [y/N]: `);
        if (addSeason.toLowerCase() !== 'y') break;

        const episodeCount = parseInt(await askQuestion(`How many episodes are in season ${seasonNumber}?: `)) || 0;
        if (episodeCount === 0) break;
        const episodes = [];
        
        for (let i = 1; i <= episodeCount; i++) {
            log(`Episode ${i} (Season ${seasonNumber})`);
            const episodeTitle = await askQuestion('Episode Title: ');
            const episodeDescription = await askQuestion('Episode Description: ');
            const episodeDuration = await askQuestion('Episode Duration (seconds): ');

            episodes.push({
                episode_number: i,
                title: episodeTitle,
                description: episodeDescription,
                duration: parseInt(episodeDuration)
            });
        }

        seasons.push({
            season_number: seasonNumber,
            episodes: episodes
        });

        ++seasonNumber;
    }

    const seriesData = {
        title,
        description,
        genres: genresRaw.split(',').map(g => g.trim()),
        cast: castRaw.split(',').map(c => c.trim()),
        release_year: parseInt(releaseYear),
        is_for_kids: isForKids.toLowerCase() === 'y',
        seasons: seasons
    };

    return seriesData;
}

// Checks for standard flags such as help or version
const stdFlag = () => {
    if (sysArgs.includes('--v') || sysArgs.includes('-v') || sysArgs.includes('--version') || sysArgs.includes('-version')) {
        console.log('v1.0.0');
        process.exit(0);
    } else if (sysArgs.includes('--h') || sysArgs.includes('-h') || sysArgs.includes('--help') || sysArgs.includes('-help')) {
        // Usage guide
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
        console.log('       --i, --input      Input folder path');
        console.log('       --t, --thumbnail  Thumbnail file path');
        process.exit(0);
    }
}

// Checks for a flag that indicates the type of media that the user will upload
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

// Checks for a flag that indicates if the user will upload the media remotelly or locally
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

// Check for the flags that indicates filename/dirname and thumbnail path
const PathsFlag = () => {
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

// Converts the movie to hls format remotelly via SSH
const remoteMovieProcess = async (inputPath, thumbnailPath, movieId) => {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        conn.on('ready', () => {
            log('SSH client connected successfully...');

            // Paths needed for the output
            const mediaDir = `/var/www/hls/movies/${movieId}`;
            const hlsCommand = `ffmpeg -i "/var/www/uploads/${inputPath}" -hls_time 10 -hls_list_size 0 -hls_segment_filename "${mediaDir}/segment_%03d.ts" -f hls "${mediaDir}/master.m3u8"`;
            const thumbCommand = `ffmpeg -i "/var/www/uploads/${thumbnailPath}" -vframes 1 -q:v 2 "${mediaDir}/thumbnail.jpeg"`;

            const fullCommand = `mkdir -p ${mediaDir} && ${hlsCommand} && ${thumbCommand}`;

            log(`Executing: ${fullCommand}`);

            conn.exec(fullCommand, (error, stream) => {
                if (error) reject(error);
                stream.on('close', (code, signal) => {
                    conn.end();
                    log(`Stream finished | Code : ${code} | Signal : ${signal}.`);
                    resolve();
                }).on('data', (data) => {
                    // Retrieves info from the host terminal
                    log(`<${process.env.SSH_USERNAME}@${process.env.SSH_HOST}:${process.env.SSH_PORT}> ${data}`);
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

// Converts the movie to hls format locally
const localProcess = async () => {
    // TODO: Make the local media process
}

// Main function to process the media
const processMedia = async () => {
    // Check for the flags needed to process the media
    stdFlag();
    const contentType = contentFlag();
    const environment = environmentFlag();
    const paths = PathsFlag();

    // Tries to connect to the database
    log('Connecting to the database, please wait...');
    try {
        await dbConnection();
        log('Database connected successfully.')
    } catch (error) {
        log(error + '.');
        process.exit(1);
    }

    // If the content type is movie creates a movie object and uploads it to the database
    if (contentType === 'movie') {
        var movieId;
        try {
            const movie = new Movie(await movieForm());
            movieId = movie._id;
            movie.stream_url = `/movies/${movieId}/master.m3u8`;
            movie.thumbnail_url = `/movies/${movieId}/thumbnail.jpeg`;
            log('Movie object created successfully!');
            log(movie);
            await movie.save();
        } catch (error) {
            log(error + '.');
            process.exit(1);
        } // Otherwise, if the content type is series, it creates a series object and uploads it to the database
    } else if (contentType === 'series') {
        var seriesId;
        try {
            const series = new Series(await seriesForm());
            seriesId = series._id;
            series.thumbnail_url = `/series/${seriesId}/thumbnail.jpeg`;
            for (let i = 0; i < series.seasons.length; ++i) {
                for (let j = 0; j < series.seasons[i].episodes.length; ++j) {
                    series.seasons[i].episodes[j].stream_url = `/series/${seriesId}/${series.seasons[i].season_number}/${series.seasons[i].episodes[j].episode_number}/master.m3u8`;
                    series.seasons[i].episodes[j].thumbnail_url = `/series/${seriesId}/${series.seasons[i].season_number}/${series.seasons[i].episodes[j].episode_number}/thumbnail.jpeg`;
                }
            }
            log('Series object created successfully!');
            log(series);
            await series.save();
        } catch (error) {
            log(error + '.');
            process.exit(1);
        }
    }

    // If the environment is remote, tries to connect to the host terminal
    if (environment === 'remote') {
        log('Connecting to the SSH client, please wait...');
        try {
            if (contentType === 'movie') await remoteMovieProcess(paths.inputPath, paths.thumbnailPath, movieId);
            else if (contentType === 'serires'); // TODO: Implement series SSH manipulation
        } catch (error) {
            log(error + '.');
            process.exit(1);
        }
    }
    // TODO: Implement local logic

    // Closes the rl interface and the mongoose connection to finish the process without errors
    rl.close();
    mongoose.connection.close();
    process.exit(0);
}

// Runs the main function 
processMedia();
