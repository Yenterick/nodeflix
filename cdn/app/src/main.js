const { app, BrowserWindow } = require('electron');
const path = require('path');

// Window creation and configuration
const createWindow = () => {
    const window = new BrowserWindow({
        width: 1000,
        height: 720,
        resizable: false,
        // TODO: Configure Mac icon on build (icns)
        icon: path.join(__dirname, '../public/assets/icon.ico'),

    });

    window.loadFile(path.join(__dirname, './web/index.html'));
}

// Starting the app when ready to open
app.whenReady().then(() => {
    createWindow();

    // Special behavior on Mac (If there are no windows opened it creates a new one);
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quitting the apps when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});