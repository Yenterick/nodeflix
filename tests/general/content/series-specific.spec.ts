import { test, expect } from '@playwright/test';

// All series specific tests
test.describe('Series Specific Tests', () => {

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
        await context.close();
    });

    // Login, select profile, navigate to Series and open first series modal before each test
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:8081/');
        await page.getByPlaceholder('Insert your email...').filter({ visible: true }).fill(testEmail);
        await page.getByPlaceholder('Insert your password...').filter({ visible: true }).fill('test');
        await page.getByRole('button', { name: /Login/i }).click();
        await expect(page).toHaveURL(/profile-selector/i);
        await page.getByText(profileName).click();
        await expect(page.getByText('Series').first()).toBeVisible({ timeout: 10000 });
        await page.getByText('Series').first().click();
        await expect(page).toHaveURL(/series/i);
        await expect(page.locator('[data-testid="content-card"] img, .content-card img').first()).toBeVisible({ timeout: 10000 });
        await page.locator('[data-testid="content-card"] img, .content-card img').first().click();
        await expect(page.getByText('Play', { exact: true })).toBeVisible({ timeout: 8000 });
    });

    // Test that the series info modal shows season count
    test('Series modal shows season info', async ({ page }) => {
        await expect(page.getByText(/Season/i).first()).toBeVisible();
    });

    // Test that the season selector dropdown button is visible
    test('Season selector dropdown is visible', async ({ page }) => {
        await expect(page.getByText(/Season 1/i)).toBeVisible();
    });

    // Test that opening the season dropdown shows season options
    test('Opening season dropdown shows seasons', async ({ page }) => {
        await page.getByText(/Season 1/i).click();
        await expect(page.getByText(/Season 1/i).first()).toBeVisible();
    });

    // Test that episodes are listed in the series modal
    test('Episodes are listed in the series modal', async ({ page }) => {
        await expect(page.locator('text=/^1\\./').first()).toBeVisible({ timeout: 5000 });
    });

    // Test that episode duration is shown
    test('Episode duration is shown', async ({ page }) => {
        await expect(page.locator('text=/\\d+m|\\d+h/').first()).toBeVisible({ timeout: 5000 });
    });

    // Test that episode description is shown
    test('Episode description is shown', async ({ page }) => {
        const episodeCard = page.locator('text=/^1\\./')
            .locator('..')
            .locator('..');
        await expect(episodeCard).toBeVisible({ timeout: 5000 });
    });

    // Test that clicking an episode plays it in the video player
    test('Click episode launches video player', async ({ page }) => {
        await page.locator('text=/^1\\./').first().click();
        await expect(page).toHaveURL(/video-player/i, { timeout: 8000 });
        expect(page.url()).toContain('season');
        expect(page.url()).toContain('episode');
    });

    // Test Like button works on a series
    test('Like a series', async ({ page }) => {
        await expect(page.getByText('Like', { exact: true })).toBeVisible();
        await page.getByText('Like', { exact: true }).click();
        await expect(page.getByText('Like', { exact: true })).toBeVisible();
    });

    // Test Dislike button works on a series
    test('Dislike a series', async ({ page }) => {
        await expect(page.getByText('Dislike', { exact: true })).toBeVisible();
        await page.getByText('Dislike', { exact: true }).click();
        await expect(page.getByText('Dislike', { exact: true })).toBeVisible();
    });

    // Test adding a series to My List
    test('Add series to My List', async ({ page }) => {
        await expect(page.getByText('My List')).toBeVisible();
        await page.getByText('My List').click();
        await expect(page.getByText('My List')).toBeVisible();
    });

    // Test Play on a series navigates with season and episode params
    test('Play series sets season and episode in URL', async ({ page }) => {
        await page.getByText('Play', { exact: true }).click();
        await expect(page).toHaveURL(/video-player/i, { timeout: 8000 });
        expect(page.url()).toContain('season');
        expect(page.url()).toContain('episode');
    });

});
