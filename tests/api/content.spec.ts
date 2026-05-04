import { test, expect } from '@playwright/test';

const API_URL = process.env.PLAYWRIGHT_API_URL || 'http://localhost:5000/api';
const AUTH_TOKEN = process.env.PLAYWRIGHT_JWT_TOKEN;

// All the content retrieval tests
test.describe('API Content Tests', () => {

    // Test getting the list of all movies
    test('Get all movies list', async ({ request }) => {
        const response = await request.get(`${API_URL}/movie/all`, {
            headers: { 'Authorization': AUTH_TOKEN || '' }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body.data)).toBe(true);
        if (body.data.length > 0) {
            expect(body.data[0]).toHaveProperty('title');
        }
    });

    // Test getting the list of all series
    test('Get all series list', async ({ request }) => {
        const response = await request.get(`${API_URL}/series/all`, {
            headers: { 'Authorization': AUTH_TOKEN || '' }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body.data)).toBe(true);
    });

    // Test searching for movies with a query
    test('Search movies by title', async ({ request }) => {
        const response = await request.get(`${API_URL}/movie/search/all`, {
            params: { q: 'a' },
            headers: { 'Authorization': AUTH_TOKEN || '' }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(true);
    });

    // Test filtering content for kids
    test('Get kids-only movies', async ({ request }) => {
        const response = await request.get(`${API_URL}/movie/kid`, {
            headers: { 'Authorization': AUTH_TOKEN || '' }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        body.data.forEach((movie: any) => {
            expect(movie.is_for_kids).toBe(true);
        });
    });

    // Test getting trending content
    test('Get trending content tendencies', async ({ request }) => {
        const response = await request.get(`${API_URL}/movie/tendencies`, {
            headers: { 'Authorization': AUTH_TOKEN || '' }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.data.length).toBeGreaterThanOrEqual(0);
    });

    // Test getting specific movie details by ID
    test('Get specific movie details', async ({ request }) => {
        const allMovies = await request.get(`${API_URL}/movie/all`, {
            headers: { 'Authorization': AUTH_TOKEN || '' }
        });
        const moviesBody = await allMovies.json();
        if (moviesBody.data.length > 0) {
            const firstMovieId = moviesBody.data[0]._id;
            const response = await request.get(`${API_URL}/movie/details/${firstMovieId}`, {
                headers: { 'Authorization': AUTH_TOKEN || '' }
            });
            expect(response.status()).toBe(200);
            const body = await response.json();
            expect(body.data._id).toBe(firstMovieId);
        }
    });

});
