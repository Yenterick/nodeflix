CREATE DATABASE nodeflix;
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(24) NOT NULL,
    screens INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS profiles (
    profile_id SERIAL PRIMARY KEY,
    name VARCHAR(12) NOT NULL,
    profile_pic VARCHAR(32) NOT NULL,
    is_kid BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INT REFERENCES users(user_id) NOT NULL
);
CREATE TABLE IF NOT EXISTS view_events (
    view_event_id SERIAL PRIMARY KEY,
    content_id INT NOT NULL,
    content_type VARCHAR(12) NOT NULL,
    season INT,
    episode INT,
    watched_seconds INT NOT NULL,
    completed BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    profile_id INT REFERENCES profiles(profile_id) NOT NULL
);