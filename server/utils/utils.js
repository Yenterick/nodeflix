// Gets a prefix with the actual time to log info
const getLogPrefix = () => {
    const now = new Date();
    const timeStamp = now.toLocaleString();
    return `[nodeflix-server@1.0.0 | ${timeStamp}] - `;
}

// Logs info in the terminal
const log = (message) => {
    console.log(`${getLogPrefix()}${message}`);
}

// Simulates time.sleep() from Python
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = { getLogPrefix, log, sleep }