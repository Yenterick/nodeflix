const { contextBridge, ipcRenderer } = require('electron');

// Expose all the functions on the renderer ipc
contextBridge.exposeInMainWorld('electronAPI', {
    testMongo: (config) => ipcRenderer.invoke('test-mongo', config),
    testSSH: (config) => ipcRenderer.invoke('test-ssh', config),
    browseFile: () => ipcRenderer.invoke('browse-file'),
    saveCredentials: (config) => ipcRenderer.invoke('save-credentials', config),
    getCredentials: () => ipcRenderer.invoke('get-credentials'),
    processMedia: (data) => ipcRenderer.invoke('process-media', data),
    getVideoDuration: (filePath) => ipcRenderer.invoke('get-video-duration', filePath),
    getAllContent: () => ipcRenderer.invoke('get-all-content'),
    processPictures: (data) => ipcRenderer.invoke('process-pictures', data),
    onProgress: (callback) => ipcRenderer.on('process-progress', (event, value) => callback(value))
});