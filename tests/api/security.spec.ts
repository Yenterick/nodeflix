import { test, expect } from '@playwright/test';

const API_URL = process.env.PLAYWRIGHT_API_URL || 'http://localhost:5000/api';

// All the security tests for the API
test.describe('API Security Tests', () => {

    // Test Rate Limiting protection by sending multiple requests
    test('Rate limiting after 100 requests', async ({ request }) => {
        test.slow();
        let lastResponse = await request.get(`${API_URL}/health`, {
            headers: { 'x-bypass-ratelimit': '' }
        });
        for (let i = 0; i < 350; i++) {
            if (lastResponse.status() === 429) break;
            lastResponse = await request.get(`${API_URL}/health`, {
                headers: { 'x-bypass-ratelimit': '' }
            });
        }
        expect(lastResponse.status()).toBe(429);
    });

    // Test trying to access protected routes without a JWT token
    test('Access protected routes without token', async ({ request }) => {
        const response = await request.get(`${API_URL}/movie/all`);
        expect(response.status()).toBe(401);
    });

    // Test trying to access protected routes with an invalid token
    test('Access protected routes with an invalid token', async ({ request }) => {
        const response = await request.get(`${API_URL}/movie/all`, {
            headers: { 'Authorization': 'Bearer wrongToken' }
        });
        expect(response.status()).toBe(401);
    });

    // Test trying to use an incorrect HTTP method on a route
    test('Use an incorrect HTTP method on a route', async ({ request }) => {
        const response = await request.post(`${API_URL}/movie/all`, { data: {} });
        expect(response.status()).toBeGreaterThanOrEqual(404);
    });

    // Test SQL Injection attempt on the login endpoint
    test('Login with a SQL Injection attempt', async ({ request }) => {
        const response = await request.post(`${API_URL}/user/login`, {
            data: {
                email: "' OR '1'='1' --",
                password: "password123"
            }
        });
        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.success).toBe(false);
    });

    // Test NoSQL Injection attempt on the movie search endpoint
    test('Search movies with a NoSQL Injection attempt', async ({ request }) => {
        const response = await request.get(`${API_URL}/movie/search/all`, {
            params: {
                'q[$ne]': 'a'
            }
        });
        expect(response.status()).not.toBe(500);
    });

});
