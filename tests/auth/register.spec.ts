import { test, expect } from '@playwright/test';

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

// All register related tests
test.describe('Register Tests', () => {
    // Go to the starting url before each test
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:8081/');
        await page.getByText('Register').click();
        await expect(page.getByText(/Register to continue.../i)).toBeVisible();
    });

    // Test confirming it goes to the register page
    test('Main navigation', async ({ page }) => {
        await expect(page.getByText(/Register to continue.../i)).toBeVisible();
        await expect(page).toHaveURL(/register/i);
    });

    // Test trying to register without filling the inputs
    test('Register with blank spaces', async ({ page }) => {
        await page.getByRole('button', { name: /Register/i }).click();
        await expect(page.getByText(`You can't send empty values!`)).toBeVisible();
        await page.getByRole('button', { name: /Accept/i }).click();
    });

    // Test trying to register without a valid email
    test('Register with an invalid email', async ({ page }) => {
        await page.getByPlaceholder('Insert your email...').nth(1).fill('wrong');
        await page.getByPlaceholder('Insert your password...').nth(1).fill('wrongPassword');
        await page.getByPlaceholder('Insert your password again...').fill('wrongPassword');
        await page.getByRole('button', { name: /Register/i }).click();
        await expect(page.getByText(`Please enter a valid email address!`)).toBeVisible();
        await page.getByRole('button', { name: /Accept/i }).click();
    });

    // Test trying to register with mismatched passwords
    test('Register with mismatched passwords', async ({ page }) => {
        await page.getByPlaceholder('Insert your email...').nth(1).fill('test@test.com');
        await page.getByPlaceholder('Insert your password...').nth(1).fill('password123');
        await page.getByPlaceholder('Insert your password again...').fill('password456');
        await page.getByRole('button', { name: /Register/i }).click();
        await expect(page.getByText(`The passwords must be the same!`)).toBeVisible();
        await page.getByRole('button', { name: /Accept/i }).click();
    });

    // Test trying to register with an already registered email
    test('Register with an already existing email', async ({ page }) => {
        await page.getByPlaceholder('Insert your email...').nth(1).fill('test@test.com');
        await page.getByPlaceholder('Insert your password...').nth(1).fill('test');
        await page.getByPlaceholder('Insert your password again...').fill('test');
        await page.getByRole('button', { name: /Register/i }).click();
        await expect(page.getByText(`Email already exists.`)).toBeVisible();
        await page.getByRole('button', { name: /Accept/i }).click();
    });

    // Test trying to register with correct credentials
    test('Register with correct credentials', async ({ page }) => {
        const uniqueEmail = `test_${Date.now()}@example.com`;
        await page.getByPlaceholder('Insert your email...').nth(1).fill(uniqueEmail);
        await page.getByPlaceholder('Insert your password...').nth(1).fill('password123');
        await page.getByPlaceholder('Insert your password again...').fill('password123');
        await page.getByRole('button', { name: /Register/i }).click();
        await expect(page.getByText(/Succesfully registered/i)).toBeVisible();
        await page.getByRole('button', { name: /Accept/i }).click();
        await expect(page).toHaveURL(/login/i);
    });
});