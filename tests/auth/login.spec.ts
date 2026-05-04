import { test, expect } from '@playwright/test';

// All login related tests
test.describe('Login Tests', () => {

    // Go to the starting url before each test
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:8081/');
    });

    // Test confirming it goes to the login page
    test('Main navigation', async ({ page }) => {
        await expect(page.getByText(/Login to continue.../i)).toBeVisible();
        await expect(page).toHaveURL(/login/i);
    });

    // Test trying to log without filling the inputs
    test('Login with blank spaces', async ({ page }) => {
        await page.getByRole('button', { name: /Login/i }).click();
        await expect(page.getByText(`You can't send empty values!`)).toBeVisible();
        await page.getByRole('button', { name: /Accept/i }).click();
    });

    // Test trying to log without a valid email
    test('Login with an invalid email', async ({ page }) => {
        await page.getByPlaceholder(/Insert your email.../i).fill('wrong');
        await page.getByPlaceholder(/Insert your password.../i).fill('wrongPassword');
        await page.getByRole('button', { name: /Login/i }).click();
        await expect(page.getByText(`Please enter a valid email address!`)).toBeVisible();
        await page.getByRole('button', { name: /Accept/i }).click();
    });

    // Test trying to log with inexistent credentials
    test('Login with inexistent credentials', async ({ page }) => {
        await page.getByPlaceholder(/Insert your email.../i).fill('wrong@wrong.com');
        await page.getByPlaceholder(/Insert your password.../i).fill('wrongPassword');
        await page.getByRole('button', { name: /Login/i }).click();
        await expect(page.getByText(`That email is not registered.`)).toBeVisible();
        await page.getByRole('button', { name: /Accept/i }).click();
    });

    // Test trying to log with incorrect password
    test('Login with incorrect password', async ({ page }) => {
        await page.getByPlaceholder(/Insert your email.../i).fill('test@test.com');
        await page.getByPlaceholder(/Insert your password.../i).fill('wrongPassword');
        await page.getByRole('button', { name: /Login/i }).click();
        await expect(page.getByText(`Incorrect password.`)).toBeVisible();
        await page.getByRole('button', { name: /Accept/i }).click();
    });

    // Test trying to log with correct credentials
    test('Login with correct credentials', async ({ page }) => {
        await page.getByPlaceholder(/Insert your email.../i).fill('test@test.com');
        await page.getByPlaceholder(/Insert your password.../i).fill('test');
        await page.getByRole('button', { name: /Login/i }).click();
        await expect(page).toHaveURL(/profile-selector/i);
    });
});