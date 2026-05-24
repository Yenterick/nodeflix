import { test, expect } from '@playwright/test';

const API_URL = process.env.PLAYWRIGHT_API_URL || 'http://localhost:5000/api';
const AUTH_TOKEN = process.env.PLAYWRIGHT_JWT_TOKEN;
const CDN_URL = process.env.PLAYWRIGHT_CDN_URL || 'http://localhost';

// Helper to construct absolute CDN URL from relative path
const getCdnUrl = (pathStr: string) => {
    const relative = pathStr.startsWith('/') ? pathStr.slice(1) : pathStr;
    return `${CDN_URL}/${relative}`;
};

test.describe('CDN Basic Tests', () => {
    test('Not existant content URL', async ({ request }) => {
        const url = getCdnUrl('movies/non-existent-id/master.m3u8');
        const response = await request.get(url);
        expect(response.status()).toBe(404);
    });
    
    test('Retrieve a movie from the CDN', async ({ request }) => {
        const response = await request.get(`${API_URL}/movie/all`, {
            headers: { 'Authorization': AUTH_TOKEN || '' }
        });
        expect(response.status()).toBe(200);
        const movieBody = await response.json();
        expect(movieBody.data && movieBody.data.length > 0).toBeTruthy();
        const movie = movieBody.data[0];
        const movieUrl = getCdnUrl(movie.thumbnail_url);
        const movieRes = await request.get(movieUrl);
        expect(movieRes.status()).toBe(200);
    });

    test('Retrieve a series from the CDN', async ({ request }) => {
        const response = await request.get(`${API_URL}/series/all`, {
            headers: { 'Authorization': AUTH_TOKEN || '' }
        });
        expect(response.status()).toBe(200);
        const seriesBody = await response.json();
        expect(seriesBody.data && seriesBody.data.length > 0).toBeTruthy();
        const series = seriesBody.data[0];
        const seriesUrl = getCdnUrl(series.thumbnail_url);
        const seriesRes = await request.get(seriesUrl);
        expect(seriesRes.status()).toBe(200);
    });

    test('Retrieve a profile picture from the CDN', async ({ request }) => {
        const response = await request.get(`${API_URL}/profilePicture`, {
            headers: { 'Authorization': AUTH_TOKEN || '' }
        });
        expect(response.status()).toBe(200);
        const pictureBody = await response.json();
        expect(pictureBody.data && pictureBody.data.length > 0).toBeTruthy();
        const entry = pictureBody.data[0];
        expect(entry.pictures && entry.pictures.length > 0).toBeTruthy();
        const pictureUrl = getCdnUrl(entry.pictures[0]);
        const pictureRes = await request.get(pictureUrl);
        expect(pictureRes.status()).toBe(200);
    });

    test('Handle stress without collapsing', async ({ request }) => {
        const url = getCdnUrl('pictures/default/1.jpeg');
        const promises = Array.from({ length: 20 }).map(() => request.get(url));
        const responses = await Promise.all(promises);
        responses.forEach(res => {
            expect([200, 404]).toContain(res.status());
        });
    });

    test('Low time to first byte', async ({ request }) => {
        const url = getCdnUrl('pictures/default/1.jpeg');
        const start = Date.now();
        const res = await request.get(url);
        const duration = Date.now() - start;
        expect(duration).toBeLessThan(500);
        expect([200, 404]).toContain(res.status());
    });
});

