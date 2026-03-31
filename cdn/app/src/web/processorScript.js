// Getting the elements from the DOM
const form = document.getElementById('mediaForm');
const movieTab = document.getElementById('movieTab');
const seriesTab = document.getElementById('seriesTab');
const movieSection = document.getElementById('movieSection');
const seriesSection = document.getElementById('seriesSection');
const processBtn = document.getElementById('processBtn');
const statusMessage = document.getElementById('processStatus');
const seasonsContainer = document.getElementById('seasonsContainer');
const addSeasonBtn = document.getElementById('addSeason');
const errorModal = document.getElementById('errorModal');
const errorModalMessage = document.getElementById('errorModalMessage');
const closeModalBtn = document.getElementById('closeModalBtn');
const backBtn = document.getElementById('backBtn');

let currentType = 'movie';

// Back to connection 
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Status handler
const showStatus = (message, type) => {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
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

// Content type changer
movieTab.addEventListener('click', () => {
    currentType = 'movie';
    movieTab.classList.add('active');
    seriesTab.classList.remove('active');
    movieSection.style.display = 'block';
    seriesSection.style.display = 'none';
});

seriesTab.addEventListener('click', () => {
    currentType = 'series';
    seriesTab.classList.add('active');
    movieTab.classList.remove('active');
    movieSection.style.display = 'none';
    seriesSection.style.display = 'block';
});

// Browse file handler
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('browse-btn')) {
        const inputId = e.target.getAttribute('data-input');
        const dataType = e.target.getAttribute('data-type');
        const filePath = await window.electronAPI.browseFile();
        if (filePath) {
            document.getElementById(inputId).value = filePath;
            
            if (dataType === 'video' || inputId === 'movieVideo') {
                showStatus('Calculating duration...', 'loading');
                const duration = await window.electronAPI.getVideoDuration(filePath);
                if (duration) {
                    if (inputId === 'movieVideo') {
                        document.getElementById('duration').value = duration;
                    } else {
                        const durationInputId = inputId.replace('-video', '-duration');
                        document.getElementById(durationInputId).value = duration;
                    }
                    showStatus('Duration calculated!', 'success');
                    setTimeout(() => {
                        statusMessage.style.display = 'none';
                    }, 2000);
                } else {
                    showStatus('Could not calculate duration automatically.', 'error');
                }
            }
        }
    }
});

// Seasons and episodes cards and logic
let seasonCount = 0;
addSeasonBtn.addEventListener('click', () => {
    seasonCount++;
    const seasonId = `season-${seasonCount}`;
    const seasonHtml = `
        <div class="season-card" id="${seasonId}" data-number="${seasonCount}">
            <div class="card-header">
                <h3>
                    Season ${seasonCount}
                </h3>
                <button 
                    type="button" 
                    class="remove-btn" 
                    onclick="document.getElementById('${seasonId}').remove()"
                >
                    Remove Season
                </button>
            </div>
            <div class="episodes-container"></div>
            <button 
                type="button" 
                class="action-btn" 
                onclick="addEpisode('${seasonId}')"
            >
                + Add Episode
            </button>
        </div>
    `;
    seasonsContainer.insertAdjacentHTML('beforeend', seasonHtml);
});

window.addEpisode = (seasonId) => {
    const seasonCard = document.getElementById(seasonId);
    const container = seasonCard.querySelector('.episodes-container');
    const seasonNumber = seasonCard.getAttribute('data-number');
    const episodeNumber = container.children.length + 1;
    const episodeId = `${seasonId}-ep-${episodeNumber}`;
    
    const epHtml = `
        <div class="episode-card" id="${episodeId}" data-number="${episodeNumber}">
            <div class="card-header">
                <h4>
                    Episode ${episodeNumber}
                </h4>
                <button 
                    type="button" 
                    class="remove-btn" 
                    onclick="document.getElementById('${episodeId}').remove()"
                >
                    Remove Episode
                </button>
            </div>
            <div class="form-group">
                <label>
                    Episode Title
                </label>
                <input 
                    type="text" 
                    class="ep-title" 
                    placeholder="Episode title..." 
                >
            </div>
            <div class="form-group" style="margin-top: 1rem;">
                <label>
                    Description
                </label>
                <textarea 
                    class="ep-description" 
                    placeholder="Episode description..."
                ></textarea>
            </div>
            <div class="form-line" style="margin-top: 1rem;">
                <div class="form-group">
                    <label>
                        Video File
                    </label>
                    <div class="file-input-group">
                        <input 
                            type="text" 
                            class="ep-video" 
                            id="${episodeId}-video" 
                            placeholder="Video path..." 
                            readonly
                        >
                        <button 
                            type="button" 
                            class="browse-btn" 
                            data-input="${episodeId}-video"
                            data-type="video"
                        >
                            Browse
                        </button>
                    </div>
                </div>
                <div class="form-group">
                    <label>
                        Duration (seconds)
                    </label>
                    <input 
                        type="number" 
                        class="ep-duration" 
                        id="${episodeId}-duration" 
                    >
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', epHtml);
};

// Process progress updates via IPC
window.electronAPI.onProgress((message) => {
    showStatus(message, 'loading');
});

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    processBtn.disabled = true;
    processBtn.textContent = 'Processing Content...';
    showStatus('Initializing process...', 'loading');

    const selectedGenres = Array.from(document.querySelectorAll('#genresContainer input:checked'))
        .map(cb => cb.value);

    const commonData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        genres: selectedGenres,
        cast: document.getElementById('cast').value.split(',').map(c => c.trim()),
        release_year: parseInt(document.getElementById('year').value),
        is_for_kids: document.getElementById('isForKids').checked
    };

    let fullData;

    try {
        if (currentType === 'movie') {
            fullData = {
                type: 'movie',
                metadata: {
                    ...commonData,
                    duration: parseInt(document.getElementById('duration').value)
                },
                files: {
                    video: document.getElementById('movieVideo').value,
                    thumbnail: document.getElementById('mainThumbnail').value
                }
            };
        } else {
            // Collects seasons and episodes
            const seasons = [];
            const files = { thumbnail: document.getElementById('mainThumbnail').value, episodes: {} };
            
            document.querySelectorAll('.season-card').forEach(s => {
                const seasonNumber = s.getAttribute('data-number');
                const episodes = [];
                s.querySelectorAll('.episode-card').forEach(ep => {
                    const epNumber = ep.getAttribute('data-number');
                    const epKey = `s${seasonNumber}e${epNumber}`;
                    
                    const titleValue = ep.querySelector('.ep-title').value;
                    const descValue = ep.querySelector('.ep-description').value;
                    const durationValue = ep.querySelector('.ep-duration').value;
                    const videoValue = ep.querySelector('.ep-video').value;

                    if (!titleValue || !videoValue || !durationValue) {
                        throw new Error(`Missing info for Season ${seasonNumber}, Episode ${epNumber}`);
                    }

                    episodes.push({
                        episode_number: parseInt(epNumber),
                        title: titleValue,
                        description: descValue || 'No description provided.',
                        duration: parseInt(durationValue)
                    });
                    files.episodes[epKey] = {
                        video: videoValue
                    };
                });
                
                if (episodes.length === 0) {
                    throw new Error(`Season ${seasonNumber} has no episodes!`);
                }
                
                seasons.push({ season_number: parseInt(seasonNumber), episodes });
            });

            fullData = {
                type: 'series',
                metadata: { ...commonData, seasons },
                files
            };
        }

        const result = await window.electronAPI.processMedia(fullData);
        if (result.success) {
            showStatus('Processing completed! Content is now in the CDN and DB.', 'success');
        } else {
            throw new Error(error.message || 'Processing failed');
        }
    } catch (err) {
        statusMessage.style.display = 'none';
        showErrorModal(err.message);
    } finally {
        processBtn.disabled = false;
        processBtn.textContent = 'Process and Upload';
    }
});
