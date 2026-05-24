import { test, expect } from '@playwright/test';

// All home tab related tests
test.describe('Home Tests', () => {

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

    // Login and select the shared profile before each test
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.PLAYWRIGHT_PAGE_URL || 'http://localhost:8081/');
        await page.getByPlaceholder('Insert your email...').filter({ visible: true }).fill(testEmail);
        await page.getByPlaceholder('Insert your password...').filter({ visible: true }).fill('test');
        await page.getByRole('button', { name: /Login/i }).click();
        await expect(page).toHaveURL(/profile-selector/i);
        await page.getByText(profileName).click();
        await expect(page.getByText('Movies').first()).toBeVisible({ timeout: 10000 });
    });

    // Test confirming the home page loads after profile selection
    test('Main navigation to home', async ({ page }) => {
        await expect(page).toHaveURL(/\//);
        await expect(page.getByText('Home')).toBeVisible();
    });

    // Test that all navbar links are visible on the home page
    test('Navbar links are visible', async ({ page }) => {
        await expect(page.getByText('Movies').first()).toBeVisible();
        await expect(page.getByText('Series').first()).toBeVisible();
        await expect(page.getByText('Search').first()).toBeVisible();
    });

    // Test navigating to the Movies tab from the home page navbar
    test('Navigate to Movies from navbar', async ({ page }) => {
        await page.getByText('Movies').first().click();
        await expect(page).toHaveURL(/movies/i);
    });

    // Test navigating to the Series tab from the home page navbar
    test('Navigate to Series from navbar', async ({ page }) => {
        await page.getByText('Series').first().click();
        await expect(page).toHaveURL(/series/i);
    });

    // Test navigating to the Search tab from the home page navbar
    test('Navigate to Search from navbar', async ({ page }) => {
        await page.getByText('Search').first().click();
        await expect(page).toHaveURL(/search/i);
    });

    // Test clicking the logout button redirects back to the profile selector
    test('Logout returns to profile selector', async ({ page }) => {
        await page.getByRole('button', { name: /logout/i }).click();
        await expect(page).toHaveURL(/profile-selector/i);
        await expect(page.getByText(/Who's watching\?/i)).toBeVisible();
    });

});