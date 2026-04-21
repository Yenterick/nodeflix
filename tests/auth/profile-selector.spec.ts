import { test, expect } from '@playwright/test';

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

// All profile selector related tests
test.describe('Profile Selector Tests', () => {
    let testEmail = '';

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        testEmail = `test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}@test.com`;
        await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:8081/');
        await page.getByText('Register').click();
        await page.getByPlaceholder('Insert your email...').nth(1).fill(testEmail);
        await page.getByPlaceholder('Insert your password...').nth(1).fill('test');
        await page.getByPlaceholder('Insert your password again...').fill('test');
        await page.getByRole('button', { name: /Register/i }).click();
        await expect(page.getByText(/Succesfully registered/i)).toBeVisible();
        await context.close();
    });

    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:8081/');
        await page.getByPlaceholder(/Insert your email.../i).fill(testEmail);
        await page.getByPlaceholder(/Insert your password.../i).fill('test');
        await page.getByRole('button', { name: /Login/i }).click();
        await expect(page).toHaveURL(/profile-selector/i);
    });

    // Test confirming it goes to the profile selector page
    test('Main navigation', async ({ page }) => {
        await expect(page.getByText(/Who's watching?/i)).toBeVisible();
        await expect(page).toHaveURL(/profile-selector/i);
    });

    // Try to change the user password with the incorrect password
    test('Change user password with the wrong password', async ({ page }) => {
        await page.getByTestId('user-settings').click();
        await page.getByPlaceholder(/Insert new password.../i).fill('newPassword');
        await page.getByPlaceholder(/Insert old password.../i).fill('wrongPassword');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('Incorrect password.')).toBeVisible();
    });

    // Create profile and delete profile
    test('Create profile and delete profile', async ({ page }) => {
        const profileName = `T${Math.random().toString(36).substring(2, 8)}`;
        await page.getByText(/New Profile/i).click();
        await page.getByPlaceholder(/Enter profile name.../i).fill(profileName);
        await page.getByRole('button', { name: 'Add' }).click();
        await expect(page.getByText('What have you seen?')).toBeVisible();
        await page.getByRole('button', { name: 'Skip' }).click();
        await expect(page.getByText(profileName)).toBeVisible();
        await page.getByRole('button', { name: 'Manage Profiles' }).click();
        await page.getByText(profileName).click();
        await expect(page.getByText('Edit Profile')).toBeVisible();
        await page.getByRole('button', { name: 'Delete Profile' }).click();
        await expect(page.getByText('Are you sure you want to delete this user?')).toBeVisible();
        await page.getByRole('button', { name: 'Confirm' }).click();
        await expect(page.getByText(profileName)).not.toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();
    });

    // Create profile without name
    test('Create profile without name', async ({ page }) => {
        await page.getByText(/New Profile/i).click();
        await page.getByRole('button', { name: 'Add' }).click();
        await expect(page.getByText('Profile name cannot be empty.')).toBeVisible();
        await page.getByRole('button', { name: 'Accept' }).click();
        await page.getByRole('button', { name: 'Cancel' }).click();
    });

    // Cancel creating a new profile
    test('Cancel creating a new profile', async ({ page }) => {
        await page.getByText(/New Profile/i).click();
        await expect(page.getByText('Add Profile')).toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(page.getByText('Add Profile')).not.toBeVisible();
    });

    // Enter user settings and close
    test('Enter user settings and close', async ({ page }) => {
        await page.getByTestId('user-settings').click();
        await expect(page.getByText('User Settings')).toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(page.getByText('User Settings')).not.toBeVisible();
    });
});