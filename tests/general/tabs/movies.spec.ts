import { test, expect } from '@playwright/test';

// All movie tab related tests
test.describe('Movie Tests', () => {

    let testEmail = '';
    let profileName = '';

    // Creates an account and one shared profile before all tests
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        testEmail = `test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}@test.com`;
        profileName = `T${Math.random().toString(36).substring(2, 8)}`;
        await page.goto(process.env.PLAYWRIGHT_PAGE_URL || 'http://localhost:8081/');
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

    // Login, select the shared profile and navigate to Movies before each test
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.PLAYWRIGHT_PAGE_URL || 'http://localhost:8081/');
        await page.getByPlaceholder('Insert your email...').filter({ visible: true }).fill(testEmail);
        await page.getByPlaceholder('Insert your password...').filter({ visible: true }).fill('test');
        await page.getByRole('button', { name: /Login/i }).click();
        await expect(page).toHaveURL(/profile-selector/i);
        await page.getByText(profileName).click();
        await expect(page.getByText('Movies').first()).toBeVisible({ timeout: 10000 });
        await page.getByText('Movies').first().click();
        await expect(page).toHaveURL(/movies/i);
    });

    // Test confirming the movies page loads correctly
    test('Main navigation to movies', async ({ page }) => {
        await expect(page).toHaveURL(/movies/i);
        await expect(page.getByText('Movies').first()).toBeVisible();
    });

    // Test that movie genre rows are displayed on the page
    test('Movie genre rows are displayed', async ({ page }) => {
        const genreRow = page.locator('text=/Movies|Action|Drama|Comedy|Horror|Thriller|Sci-Fi|Romance|Documentary|Animation|Family|Fantasy|Crime/i').first();
        await expect(genreRow).toBeVisible();
    });

    // Test clicking on a movie opens its info modal
    test('Click on a movie opens info modal', async ({ page }) => {
        const firstCard = page.locator('[data-testid="content-card"] img, .content-card img').first();
        await firstCard.click();
        await expect(page.getByRole('button', { name: /Add to List|Watch Now|Play|Remove/i }).first()).toBeVisible();
    });

    // Test that the info modal can be closed
    test('Close movie info modal', async ({ page }) => {
        const firstCard = page.locator('[data-testid="content-card"] img, .content-card img').first();
        await firstCard.click();
        await page.getByRole('button', { name: /Close|X|✕/i }).first().click();
        await expect(page).toHaveURL(/movies/i);
    });

    // Test navigating from Movies to Search via navbar
    test('Navigate from Movies to Search', async ({ page }) => {
        await page.getByText('Search').click();
        await expect(page).toHaveURL(/search/i);
    });

    // Test navigating from Movies to Home via navbar
    test('Navigate from Movies to Home', async ({ page }) => {
        await page.getByText('Home').first().click();
        await expect(page).toHaveURL(/\//);
    });

});