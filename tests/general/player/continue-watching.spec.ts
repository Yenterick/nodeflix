import { test, expect } from '@playwright/test';

// All continue watching functionality tests
test.describe('Continue Watching Tests', () => {

    let testEmail = '';
    let profileName = '';

    // Creates an account and one shared profile before all tests
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        testEmail = `test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}@test.com`;
        profileName = `T${Math.random().toString(36).substring(2, 8)}`;
        await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:8081/');
        await page.getByText('Register').click();
        await page.getByPlaceholder('Insert your email...').filter({ visible: true }).fill(testEmail);
        await page.getByPlaceholder('Insert your password...').filter({ visible: true }).fill('test');
        await page.getByPlaceholder('Insert your password again...').fill('test');
        await page.getByRole('button', { name: /Register/i }).click();
        await expect(page.getByText(/Succesfully registered/i)).toBeVisible();
        await page.getByRole('button', { name: /Accept/i }).click();
        await page.getByPlaceholder('Insert your email...').filter({ visible: true }).fill(testEmail);
        await page.getByPlaceholder('Insert your password...').filter({ visible: true }).fill('test');
        await page.getByRole('button', { name: /Login/i }).click();
        await expect(page).toHaveURL(/profile-selector/i);
        await page.getByText(/New Profile/i).click();
        await page.getByPlaceholder(/Enter profile name.../i).fill(profileName);
        await page.getByRole('button', { name: 'Add' }).click();
        await expect(page.getByText('What have you seen?')).toBeVisible({ timeout: 10000 });
        await page.getByRole('button', { name: 'Skip' }).click();
        await expect(page.getByText(profileName)).toBeVisible();
        await page.getByText(profileName).click();
        await expect(page.getByText('Movies').first()).toBeVisible({ timeout: 10000 });
        await page.getByText('Movies').first().click();
        await expect(page).toHaveURL(/movies/i);
        await page.locator('[data-testid="content-card"] img, .content-card img').first().click();
        await expect(page.getByText('Play')).toBeVisible({ timeout: 8000 });
        await page.getByText('Play').click();
        await expect(page).toHaveURL(/video-player/i, { timeout: 8000 });
        await page.waitForTimeout(6500);
        await page.goBack();
        await context.close();
    });

    // Login and go to home before each test
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:8081/');
        await page.getByPlaceholder('Insert your email...').filter({ visible: true }).fill(testEmail);
        await page.getByPlaceholder('Insert your password...').filter({ visible: true }).fill('test');
        await page.getByRole('button', { name: /Login/i }).click();
        await expect(page).toHaveURL(/profile-selector/i);
        await page.getByText(profileName).click();
        await expect(page.getByText('Movies').first()).toBeVisible({ timeout: 10000 });
        await expect(page).toHaveURL(/\//);
    });

    // Test Continue Watching row appears on home after watching a movie
    test('Continue Watching row appears on home', async ({ page }) => {
        await expect(page.getByText('Continue Watching').first()).toBeVisible({ timeout: 8000 });
    });

    // Test that the watched movie card appears in Continue Watching
    test('Watched movie appears in Continue Watching', async ({ page }) => {
        await expect(page.getByText('Continue Watching').first()).toBeVisible({ timeout: 8000 });
        await expect(page.locator('img').first()).toBeVisible();
    });

    // Test clicking Continue Watching item opens modal with "Continue Watching" button
    test('Continue Watching item shows resume button in modal', async ({ page }) => {
        await expect(page.getByText('Continue Watching').first()).toBeVisible({ timeout: 8000 });
        await page.locator('[data-testid="content-card"] img, .content-card img').first().click();
        await expect(page.getByRole('button', { name: 'Continue Watching' }).first()).toBeVisible({ timeout: 8000 });
    });

    // Test pressing Continue Watching in modal navigates to video player with saved progress
    test('Continue Watching resumes video player', async ({ page }) => {
        await page.locator('[data-testid="content-card"] img, .content-card img').first().click();
        await expect(page.getByRole('button', { name: 'Continue Watching' }).first()).toBeVisible({ timeout: 8000 });
        await page.getByRole('button', { name: 'Continue Watching' }).first().click();
        await expect(page).toHaveURL(/video-player/i, { timeout: 8000 });
        expect(page.url()).toContain('watchedProgress');
    });

    // Test that Top 10 Trending row is also visible on home
    test('Top 10 Trending row is visible', async ({ page }) => {
        await expect(page.getByText('Top 10 Trending')).toBeVisible({ timeout: 8000 });
    });

});
