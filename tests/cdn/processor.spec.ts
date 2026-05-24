import { test, expect, _electron as electron, type ElectronApplication, type Page } from '@playwright/test';
import path from 'path';

const API_URL   = process.env.PLAYWRIGHT_API_URL   || 'http://localhost:5000/api';
const AUTH_TOKEN = process.env.PLAYWRIGHT_JWT_TOKEN;
const CDN_URL   = (process.env.PLAYWRIGHT_CDN_URL  || 'http://localhost').replace(/\/$/, '');

test.describe.configure({ mode: 'serial' });

test.describe('CDN Processor tests', () => {
    let electronApp: ElectronApplication;
    let appWindow: Page;
    let movieId = '';

    test.beforeAll(async () => {
        electronApp = await electron.launch({
            args: [process.env.PLAYWRIGHT_CONTENT_PROCESSOR_ROUTE || '']
        });
        appWindow = await electronApp.firstWindow();
        appWindow.on('console', msg => console.log('PAGE LOG:', msg.text()));
    });

    test.afterAll(async () => {
        if (electronApp) {
            await electronApp.close();
        }
    });

    test('Navigate through the windows', async () => {
        await appWindow.waitForSelector('#mongoHost');
        await appWindow.waitForFunction(() => {
            const el = document.getElementById('mongoHost') as HTMLInputElement | null;
            return !!el && el.value.length > 0;
        }, undefined, { timeout: 10000 });
        await appWindow.click('#connectBtn');
        await appWindow.waitForURL(/processor\.html/, { timeout: 12000 });
        await expect(appWindow.locator('#movieTab')).toBeVisible();
    });

    test('Upload without all the metadata', async () => {
        await appWindow.click('#movieTab');
        await appWindow.fill('#title', 'Incomplete Movie');
        await appWindow.fill('#description', '');
        await appWindow.click('#processBtn');
        const errorModal = appWindow.locator('#errorModal');
        const errorMessage = appWindow.locator('#errorModalMessage');
        await expect(errorModal).toBeVisible();
        await expect(errorMessage).toHaveText(/Data missing\./i);
        await appWindow.click('#closeModalBtn');
        await expect(errorModal).not.toBeVisible();
    });

    test('Upload a custom movie', async () => {
        await appWindow.click('#movieTab');
        await appWindow.fill('#title', 'Zacarias quer sorvete?');
        await appWindow.fill('#year', '2025');
        await appWindow.fill('#description', 'Zacarías the kitten takes a bite of an ice cream cone and refuses to let go while his owner tries to pull it away.');
        await appWindow.fill('#cast', 'Zacarias, Sorvete');
        await appWindow.click('.genre-chip:has-text("Comedy")');
        await appWindow.click('.genre-chip:has-text("Family")');
        await appWindow.check('#isForKids');
        const videoPath     = path.resolve(__dirname, 'fixtures', 'zacarias.mp4');
        const thumbnailPath = path.resolve(__dirname, 'fixtures', 'zacarias.png');
        await appWindow.evaluate(({ video, thumb }) => {
            (document.getElementById('movieVideo')    as HTMLInputElement).value = video;
            (document.getElementById('mainThumbnail') as HTMLInputElement).value = thumb;
            (document.getElementById('duration')      as HTMLInputElement).value = '120';
        }, { video: videoPath, thumb: thumbnailPath });
        await appWindow.click('#processBtn');
        const status = appWindow.locator('#processStatus');
        await expect(status).toHaveText(/Processing completed! Content is now in the CDN and DB\./i, { timeout: 45000 });
    });

    test('Check the existence of the newly created movie', async ({ request }) => {
        const response = await request.get(`${API_URL}/movie/all`, {
            headers: { 'Authorization': AUTH_TOKEN || '' }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        const movie = body.data.find((m: any) => m.title === 'Zacarias quer sorvete?');
        expect(movie).toBeDefined();
        movieId = movie._id;
        const streamRes = await request.get(`${CDN_URL}/movies/${movieId}/master.m3u8`);
        expect(streamRes.status()).toBe(200);
        const thumbRes = await request.get(`${CDN_URL}/movies/${movieId}/thumbnail.jpeg`);
        expect(thumbRes.status()).toBe(200);
    });

    test('Edit the created movie', async ({ request }) => {
        await appWindow.click('#manageTab');
        await appWindow.waitForSelector('#manageSection', { state: 'visible' });
        await appWindow.waitForSelector('#manageContentList .content-list-item', { timeout: 15000 });
        const movieItem = appWindow.locator(`#manageContentList .content-list-item[data-id="${movieId}"]`);
        await movieItem.waitFor({ timeout: 10000 });
        await movieItem.click();
        await appWindow.waitForSelector('#manageEditForm', { state: 'visible' });
        await appWindow.fill('#editMovieTitle', 'Zacarias Edited');
        await appWindow.click('#saveEditBtn');
        const status = appWindow.locator('#processStatus');
        await expect(status).toHaveText(/Changes saved successfully!/i, { timeout: 10000 });
        const response = await request.get(`${API_URL}/movie/all`, {
            headers: { 'Authorization': AUTH_TOKEN || '' }
        });
        expect(response.status()).toBe(200);
        const body  = await response.json();
        const movie = body.data.find((m: any) => m._id === movieId);
        expect(movie?.title).toBe('Zacarias Edited');
    });

    test('Delete the created movie', async ({ request }) => {
        await appWindow.click('#manageTab');
        await appWindow.waitForSelector('#manageSection', { state: 'visible' });
        await appWindow.waitForSelector('#manageContentList .content-list-item', { timeout: 15000 });
        const movieItem = appWindow.locator(`#manageContentList .content-list-item[data-id="${movieId}"]`);
        await movieItem.waitFor({ timeout: 10000 });
        await movieItem.click();
        await appWindow.waitForSelector('#manageEditForm', { state: 'visible' });
        await appWindow.click('#deleteBtn');
        const confirmModal = appWindow.locator('#confirmModal');
        await expect(confirmModal).toBeVisible();
        await appWindow.click('#confirmOkBtn');
        const status = appWindow.locator('#processStatus');
        await expect(status).toHaveText(/Content deleted successfully from both DB and CDN!/i, { timeout: 15000 });
        const response = await request.get(`${API_URL}/movie/all`, {
            headers: { 'Authorization': AUTH_TOKEN || '' }
        });
        expect(response.status()).toBe(200);
        const body  = await response.json();
        const movie = body.data.find((m: any) => m._id === movieId);
        expect(movie).toBeUndefined();
        const streamRes = await request.get(`${CDN_URL}/movies/${movieId}/master.m3u8`);
        expect(streamRes.status()).toBe(404);
        const thumbRes = await request.get(`${CDN_URL}/movies/${movieId}/thumbnail.jpeg`);
        expect(thumbRes.status()).toBe(404);
    });
});