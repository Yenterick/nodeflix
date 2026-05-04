import { test, expect } from '@playwright/test';

const API_URL = process.env.PLAYWRIGHT_API_URL || 'http://localhost:5000/api';

// All the API basic tests
test.describe('API Basics Tests', () => {

    // Test the health check endpoint status
    test('Server health check status', async ({ request }) => {
        const response = await request.get(`${API_URL}/health`);
        expect(response.status()).toBe(200);
    });

    // Test the health check response body content
    test('Server health check response body', async ({ request }) => {
        const response = await request.get(`${API_URL}/health`);
        const body = await response.json();
        expect(body).toEqual(expect.objectContaining({
            success: true,
            msg: 'Nodeflix server is up and healthy!'
        }));
    });

    // Test if swagger documentation is accessible
    test('API documentation accessibility', async ({ request }) => {
        const response = await request.get(`${API_URL}/docs/`);
        expect(response.status()).toBe(200);
        const text = await response.text();
        expect(text).toContain('swagger');
    });

    // Test the 404 handler for wrong routes routes
    test('Handle non-existing API routes', async ({ request }) => {
        const response = await request.get(`${API_URL}/wrong`);
        expect(response.status()).toBe(404);
    });

    // Test CORS configuration
    test('CORS policy configuration', async ({ request }) => {
        const response = await request.get(`${API_URL}/health`);
        const headers = response.headers();
        expect(headers['access-control-allow-origin']).toBe('*');
    });

    // Test security by checking if sensitive headers are hidden
    test('Security header check (X-Powered-By)', async ({ request }) => {
        const response = await request.get(`${API_URL}/health`);
        const headers = response.headers();
        expect(headers['x-powered-by']).toBeUndefined();
    });
});
