<p align="center">
    <img src="./docs/nodeflixDatabase.png" alt="Nodeflix Database"/>
</p>

<p align="center">
    Database layer responsible for storing, organizing, and managing all persistent data for the 'Nodeflix' streaming application.
</p>

<p align="center">
    <a href="#"><img src="https://img.shields.io/badge/PostgreSQL-Relational-blue?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
    <a href="#"><img src="https://img.shields.io/badge/MongoDB-NoSQL-green?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"></a>
    <a href="#"><img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status"></a>
    <a href="#"><img src="https://img.shields.io/badge/Version-1.0.0-orange?style=for-the-badge" alt="Version"></a>
    <a href="#"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"></a>
    <a href="#"><img src="https://img.shields.io/badge/Built%20by-Yenterick-blueviolet?style=for-the-badge" alt="Built by Yenterick"></a>
</p>

---

This database system is designed to support all data operations within Nodeflix, combining relational and non-relational approaches:

- PostgreSQL for structured and relational data (users, content, relationships).
- MongoDB for nested data models (movies, series...).
- Optimized data models for streaming platforms.
- Efficient querying and indexing strategies.
- Separation of concerns between transactional and non-transactional data.

---

## Database Architecture

<p align="center">
    <img src="./docs/databaseDiagramV2.png" alt="Database Diagram"/>
</p>

---

## Data Responsibilities

### PostgreSQL (Relational Layer)

Handles structured and transactional data:

- **users** → Stores account credentials and basic user configuration.
- **profiles** → Represents individual user profiles (multi-profile system).
- **view_events** → Tracks content consumption (watch time, completion, episodes).
- **interaction_events** → Stores user actions (likes, dislikes).
- **list_events** → Manages user lists and saved content.

---

### MongoDB (Content Layer)

Handles flexible and content-heavy data:

- **movies** → Stores movie metadata including duration, genres, cast, and streaming URLs.
- **series** → Stores series data with nested seasons and episodes.
- **profile_pictures** → Stores available profile images.

---

## License

This project is licensed under the MIT License.

## Author

Yenterick