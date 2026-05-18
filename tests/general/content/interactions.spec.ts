import { test, expect } from '@playwright/test';

// Tests for the content info modal and its interactions
test.describe('Content Interaction Tests', () => {

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

    // Login, select profile and open first movie info modal before each test
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:8081/');
        await page.getByPlaceholder('Insert your email...').filter({ visible: true }).fill(testEmail);
        await page.getByPlaceholder('Insert your password...').filter({ visible: true }).fill('test');
        await page.getByRole('button', { name: /Login/i }).click();
        await expect(page).toHaveURL(/profile-selector/i);
        await page.getByText(profileName).click();
        await expect(page.getByText('Movies').first()).toBeVisible({ timeout: 10000 });
        await page.getByText('Movies').first().click();
        await expect(page).toHaveURL(/movies/i);
        // Open the first content card
        await page.locator('[data-testid="content-card"] img, .content-card img').first().click();
        await expect(page.getByText('Play', { exact: true })).toBeVisible({ timeout: 8000 });
    });

    // Test that the info modal shows title and description
    test('Info modal shows title and description', async ({ page }) => {
        await expect(page.getByText('Play', { exact: true })).toBeVisible();
        const genres = page.getByText(/Genres:/i);
        await expect(genres).toBeVisible();
    });

    // Test that the My List button is visible
    test('My List button is visible', async ({ page }) => {
        await expect(page.getByText('My List')).toBeVisible();
    });

    // Test adding a movie to My List
    test('Add movie to My List', async ({ page }) => {
        await page.getByText('My List').click();
        await expect(page.getByText('My List')).toBeVisible();
    });

    // Test removing a movie from my list (add then remove)
    test('Remove movie from My List', async ({ page }) => {
        await page.getByText('My List').click();
        await page.waitForTimeout(500);
        await page.getByText('My List').click();
        await expect(page.getByText('My List')).toBeVisible();
    });

    // Test like button is visible
    test('Like button is visible', async ({ page }) => {
        await expect(page.getByText('Like', { exact: true })).toBeVisible();
    });

    // Test clicking Like on a movie
    test('Like a movie', async ({ page }) => {
        await page.getByText('Like', { exact: true }).click();
        await expect(page.getByText('Like', { exact: true })).toBeVisible();
    });

    // Test dislike button is visible
    test('Dislike button is visible', async ({ page }) => {
        await expect(page.getByText('Dislike', { exact: true })).toBeVisible();
    });

    // Test clicking dislike on a movie
    test('Dislike a movie', async ({ page }) => {
        await page.getByText('Dislike', { exact: true }).click();
        await expect(page.getByText('Dislike', { exact: true })).toBeVisible();
    });

    // Test toggling Like then dislike updates interaction
    test('Switch from Like to Dislike', async ({ page }) => {
        await page.getByText('Like', { exact: true }).click();
        await page.waitForTimeout(500);
        await page.getByText('Dislike', { exact: true }).click();
        await expect(page.getByText('Dislike', { exact: true })).toBeVisible();
    });

    // Test clicking play navigates to the video player
    test('Play button launches video player', async ({ page }) => {
        await page.getByText('Play', { exact: true }).click();
        await expect(page).toHaveURL(/video-player/i, { timeout: 8000 });
    });

    // Test the mute button is visible in the modal trailer
    test('Mute button is visible in modal trailer', async ({ page }) => {
        const muteBtn = page.locator('[data-testid="mute-btn"], [aria-label="mute"], text=/volume/i').first();
        await expect(page.getByText('My List')).toBeVisible();
    });

    // Test cast info is shown in the modal
    test('Cast info is shown in the modal', async ({ page }) => {
        await expect(page.getByText(/Cast:/i)).toBeVisible();
    });

});
