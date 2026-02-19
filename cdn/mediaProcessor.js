const { dbConnection } = require('./config/database');
const Movie = require('./models/movie');
const Series = require('./models/series');
const sysArgs = process.argv.slice(2);

const getLogDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
}

const sampleMovie = {
    title: "Sample Movie",
    description: "Sample Movie",
    genres: ["Action", "Romance"],
    cast: ["Actor_1", "Actor_2"],
    release_year: 2024,
    duration: 120,
    thumbnail_url: "sample_thumbnail.jpeg",
    stream_url: "sample_stream.mp4",
    is_for_kids: false
};

const sampleSeries = {
    title: "Sample Series",
    description: "Sample Series",
    genres: ["Drama", "Mystery"],
    cast: ["Actor_1", "Actor_2"],
    release_year: 2023,
    thumbnail_url: "sample_thumbnail.jpeg",
    is_for_kids: true,
    seasons: [
        {
            season_number: 1,
            episodes: [
                {
                    episode_number: 1,
                    title: "First Episode",
                    description: "First Episode",
                    duration: 45,
                    thumbnail_url: "sample_thumbnail.jpeg",
                    stream_url: "sample_stream.mp4"
                }
            ]
        }
    ]
};

const processMedia = async () => {
    try {
        await dbConnection();
        const mongoose = require('mongoose');

        if (sysArgs.includes('--m')) {
            console.log(`[nodeflix-cdn@1.0.0 | ${getLogDateTime()}] - You are going to append a movie to the database...`);
            const movie = new Movie(sampleMovie);
            await movie.save();
            console.log(`[nodeflix-cdn@1.0.0 | ${getLogDateTime()}] - Movie saved successfully: ${movie.title}`);

        } else if (sysArgs.includes('--s')) {
            console.log(`[nodeflix-cdn@1.0.0 | ${getLogDateTime()}] - You are going to append a series to the database...`);
            const series = new Series(sampleSeries);
            await series.save();
            console.log(`[nodeflix-cdn@1.0.0 | ${getLogDateTime()}] - Series saved successfully: ${series.title}`);

        } else {
            console.error(`[nodeflix-cdn@1.0.0 | ${getLogDateTime()}] - You need to select a media type with '--m' or '--s'!`)
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error(`[nodeflix-cdn@1.0.0 | ${getLogDateTime()}] - Error processing media:`, error.message);
    }
}

processMedia();