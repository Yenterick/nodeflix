import { test, expect } from '@playwright/test';

// Tests for the video player and continue watching functionality
test.describe('Video Player Tests', () => {

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

    // Login, select profile, open movie and launch video player before each test
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
        await page.locator('[data-testid="content-card"] img, .content-card img').first().click();
        await expect(page.getByText('Play', { exact: true })).toBeVisible({ timeout: 8000 });
        await page.getByText('Play', { exact: true }).click();
        await expect(page).toHaveURL(/video-player/i, { timeout: 8000 });
        await expect(page.getByTestId('video-tap-zone')).toBeVisible({ timeout: 10000 });
    });

    // Test the video player page loads
    test('Video player page loads', async ({ page }) => {
        await expect(page).toHaveURL(/video-player/i);
    });

    // Test video controls appear on tap/click
    test('Video controls appear on click', async ({ page }) => {
        // Firefox gets crazy when trying to load a .hls so we need to close the expo error
        try {
            await page.getByText('Dismiss').click({ timeout: 2000 });
            await page.waitForTimeout(300);
        } catch {
            // pass
        }
        await page.getByTestId('video-tap-zone').click({ force: true });
        await expect(page.locator('[data-testid="video-exit-button"]').first()).toBeVisible({ timeout: 10000 });
    });

    // Test the back button returns to previous page
    test('Back button returns from video player', async ({ page }) => {
        await page.getByTestId('video-tap-zone').click({ force: true });
        await page.waitForTimeout(500);
        await page.goBack();
        await expect(page).toHaveURL(/movies/i);
    });

    // Test that the URL contains contentId and contentType params
    test('Video player URL contains correct params', async ({ page }) => {
        const url = page.url();
        expect(url).toContain('contentId');
        expect(url).toContain('contentType');
    });

    // Test video element is present in the DOM
    test('Video element is rendered', async ({ page }) => {
        const video = page.locator('video');
        await expect(video).toBeAttached({ timeout: 8000 });
    });

    // Test navigating back manually preserves navigation history
    test('Browser back from video player works', async ({ page }) => {
        await page.goBack();
        await expect(page).not.toHaveURL(/video-player/i);
    });

});

