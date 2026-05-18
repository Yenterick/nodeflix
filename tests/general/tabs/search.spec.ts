import { test, expect } from '@playwright/test';

// All search tab related tests
test.describe('Search Tests', () => {

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

    // Login, select the shared profile and navigate to Search before each test
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.PLAYWRIGHT_URL || 'http://localhost:8081/');
        await page.getByPlaceholder('Insert your email...').filter({ visible: true }).fill(testEmail);
        await page.getByPlaceholder('Insert your password...').filter({ visible: true }).fill('test');
        await page.getByRole('button', { name: /Login/i }).click();
        await expect(page).toHaveURL(/profile-selector/i);
        await page.getByText(profileName).click();
        await expect(page.getByText('Search').first()).toBeVisible({ timeout: 10000 });
        await page.getByText('Search').first().click();
        await expect(page).toHaveURL(/search/i);
    });

    // Test confirming the search page loads correctly
    test('Main navigation to search', async ({ page }) => {
        await expect(page).toHaveURL(/search/i);
        await expect(page.locator('#search-input')).toBeVisible();
    });

    // Test that the genre filter chips are visible
    test('Genre filter chips are visible', async ({ page }) => {
        await expect(page.locator('#genre-filter-all')).toBeVisible();
        await expect(page.locator('#genre-filter-action')).toBeVisible();
    });

    // Test that the content type filter pills are visible
    test('Content type filter pills are visible', async ({ page }) => {
        await expect(page.locator('#type-filter-all')).toBeVisible();
        await expect(page.locator('#type-filter-movies')).toBeVisible();
        await expect(page.locator('#type-filter-series')).toBeVisible();
    });

    // Test typing in the search bar returns results label
    test('Search query shows results count', async ({ page }) => {
        await page.locator('#search-input').fill('a');
        await expect(page.getByText(/Result|No results/i)).toBeVisible({ timeout: 5000 });
    });

    // Test filtering by Movies type
    test('Filter by Movies type', async ({ page }) => {
        await page.locator('#type-filter-movies').click();
        await expect(page.getByText(/Result|No results/i)).toBeVisible({ timeout: 5000 });
    });

    // Test filtering by Action genre chip
    test('Filter by Action genre', async ({ page }) => {
        await page.locator('#genre-filter-action').click();
        await expect(page.getByText(/Result|No results/i)).toBeVisible({ timeout: 5000 });
    });

});