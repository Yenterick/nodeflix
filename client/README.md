<p align="center">
    <img src="./docs/nodeflixClient.png" alt="Nodeflix Client"/>
</p>

<p align="center">
    Frontend client responsible for rendering the user interface, handling user interactions, and communicating with backend and CDN services for the 'Nodeflix' streaming application.
</p>

<p align="center">
    <a href="#"><img src="https://img.shields.io/badge/React_Native-0.7x-blue?style=for-the-badge&logo=react&logoColor=white" alt="React Native"></a>
    <a href="#"><img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo"></a>
    <a href="#"><img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status"></a>
    <a href="#"><img src="https://img.shields.io/badge/Version-1.0.0-orange?style=for-the-badge" alt="Version"></a>
    <a href="#"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"></a>
    <a href="#"><img src="https://img.shields.io/badge/Built%20by-Yenterick-blueviolet?style=for-the-badge" alt="Built by Yenterick"></a>
</p>

---

This client application delivers the full user experience for Nodeflix, including content browsing, profile management, and media playback.

- User authentication and session handling.
- Multi-profile system similar to streaming platforms.
- Browsing movies and series by categories and genres.
- Video playback using HLS streaming via CDN.
- User interactions such as viewing progress and lists.
- Responsive mobile-first interface.

---

## Application

To run the client locally, first configure the environment variables:

```bash
cp .env.example .env
```

Then install the dependencies and start the application:

```bash
npm install
npm start
```

Then open using:

- Expo Go (mobile)
- Android Emulator
- iOS Simulator
- Web Browser

---

## Integration

The client integrates with the system as follows:

- **Backend API** → Handles authentication, metadata, and user interactions.
- **CDN** → Serves video streams, thumbnails, and media assets.

Environment variables are used to configure API endpoints and services.

---

## License

This project is licensed under the MIT License.

## Author

Yenterick