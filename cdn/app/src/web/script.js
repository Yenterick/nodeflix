// Getting the elements from the DOM
const form = document.querySelector('.environment-form');
const connectBtn = document.getElementById('connectBtn');
const statusMessage = document.getElementById('statusMessage');
const browseSshKeyBtn = document.getElementById('browseSshKey');
const sshKeyPathInput = document.getElementById('sshKeyPath');
const rememberMeCheckbox = document.getElementById('rememberMe');
const errorModal = document.getElementById('errorModal');
const errorModalMessage = document.getElementById('errorModalMessage');
const closeModalBtn = document.getElementById('closeModalBtn');

// Status handler
const showStatus = (message, type) => {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
};

// Error modal handlers
const showErrorModal = (message) => {
    errorModalMessage.textContent = message;
    errorModal.style.display = 'flex';
};

const closeErrorModal = () => {
    errorModal.style.display = 'none';
};

closeModalBtn.addEventListener('click', closeErrorModal);

// Browse file handler
browseSshKeyBtn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.browseFile();
    if (filePath) {
        sshKeyPathInput.value = filePath;
    }
});

// Checking if there is valid information on the .env file
window.addEventListener('DOMContentLoaded', async () => {
    const credentials = await window.electronAPI.getCredentials();
    if (credentials) {
        document.getElementById('mongoHost').value = credentials.MONGO_HOST || '';
        document.getElementById('mongoPort').value = credentials.MONGO_PORT || '';
        document.getElementById('mongoUsername').value = credentials.MONGO_USERNAME || '';
        document.getElementById('mongoPassword').value = credentials.MONGO_PASSWORD || '';
        document.getElementById('mongoDb').value = credentials.MONGO_DB || '';
        document.getElementById('sshHost').value = credentials.SSH_HOST || '';
        document.getElementById('sshPort').value = credentials.SSH_PORT || '';
        document.getElementById('sshUsername').value = credentials.SSH_USERNAME || '';
        sshKeyPathInput.value = credentials.SSH_KEY_PATH || '';
        rememberMeCheckbox.checked = true;
    }
});

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable button and show loading
    connectBtn.disabled = true;
    showStatus('Connecting to MongoDB and SSH...', 'Loading...');
    
    // Get values from the form
    const mongoConfig = {
        host: document.getElementById('mongoHost').value,
        port: document.getElementById('mongoPort').value,
        username: document.getElementById('mongoUsername').value,
        password: document.getElementById('mongoPassword').value,
        database: document.getElementById('mongoDb').value
    };
    
    const sshConfig = {
        host: document.getElementById('sshHost').value,
        port: document.getElementById('sshPort').value,
        username: document.getElementById('sshUsername').value,
        keyPath: sshKeyPathInput.value
    };
    
    try {
        // Test if Mongo info is correct
        const mongoRes = await window.electronAPI.testMongo(mongoConfig);
        if (!mongoRes.success) {
            throw new Error(`MongoDB Connection Failed: ${mongoRes.error}`);
        }
        
        // Test if SSH info is correct
        const sshRes = await window.electronAPI.testSSH(sshConfig);
        if (!sshRes.success) {
            throw new Error(`SSH Connection Failed: ${sshRes.error}`);
        }
        
        // Save if remember me is checked
        if (rememberMeCheckbox.checked) {
            await window.electronAPI.saveCredentials({
                MONGO_HOST: mongoConfig.host,
                MONGO_PORT: mongoConfig.port,
                MONGO_USERNAME: mongoConfig.username,
                MONGO_PASSWORD: mongoConfig.password,
                MONGO_DB: mongoConfig.database,
                SSH_HOST: sshConfig.host,
                SSH_PORT: sshConfig.port,
                SSH_USERNAME: sshConfig.username,
                SSH_KEY_PATH: sshConfig.keyPath
            });
        }
        
        showStatus('Both connections successful! Redirecting...', 'Success');
        
        setTimeout(() => {
            window.location.href = 'processor.html';
        }, 1500);
        
    } catch (error) {
        statusMessage.style.display = 'none';
        showErrorModal(error.message);
    } finally {
        connectBtn.disabled = false;
    }
});
