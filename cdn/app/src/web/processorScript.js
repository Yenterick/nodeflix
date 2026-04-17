// Getting the elements from the DOM
const form = document.getElementById('mediaForm');
const movieTab = document.getElementById('movieTab');
const seriesTab = document.getElementById('seriesTab');
const picturesTab = document.getElementById('picturesTab');
const movieSection = document.getElementById('movieSection');
const seriesSection = document.getElementById('seriesSection');
const picturesSection = document.getElementById('picturesSection');
const commonFields = document.getElementById('commonFields');
const processBtn = document.getElementById('processBtn');
const statusMessage = document.getElementById('processStatus');
const seasonsContainer = document.getElementById('seasonsContainer');
const addSeasonBtn = document.getElementById('addSeason');
const errorModal = document.getElementById('errorModal');
const errorModalMessage = document.getElementById('errorModalMessage');
const closeModalBtn = document.getElementById('closeModalBtn');
const backBtn = document.getElementById('backBtn');
const selectedContentName = document.getElementById('selectedContentName');
const photosContainer = document.getElementById('photosContainer');
const addPhotoBtn = document.getElementById('addPhoto');

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
    picturesTab.classList.remove('active');
    commonFields.style.display = 'block';
    movieSection.style.display = 'block';
    seriesSection.style.display = 'none';
    picturesSection.style.display = 'none';
});

seriesTab.addEventListener('click', () => {
    currentType = 'series';
    seriesTab.classList.add('active');
    movieTab.classList.remove('active');
    picturesTab.classList.remove('active');
    commonFields.style.display = 'block';
    movieSection.style.display = 'none';
    seriesSection.style.display = 'block';
    picturesSection.style.display = 'none';
});

picturesTab.addEventListener('click', () => {
    currentType = 'pictures';
    picturesTab.classList.add('active');
    movieTab.classList.remove('active');
    seriesTab.classList.remove('active');
    commonFields.style.display = 'none';
    movieSection.style.display = 'none';
    seriesSection.style.display = 'none';
    picturesSection.style.display = 'block';
    loadContentLists();
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

// Seasons and episodes cards
window.removeSeason = (seasonId) => {
    document.getElementById(seasonId).remove();
    seasonsContainer.querySelectorAll('.season-card').forEach((card, index) => {
        const num = index + 1;
        card.setAttribute('data-number', num);
        card.querySelector('.card-header h3').textContent = `Season ${num}`;
    });
};

window.removeEpisode = (episodeId, seasonId) => {
    document.getElementById(episodeId).remove();
    const seasonCard = document.getElementById(seasonId);
    if (seasonCard) {
        seasonCard.querySelectorAll('.episode-card').forEach((card, index) => {
            const num = index + 1;
            card.setAttribute('data-number', num);
            card.querySelector('.card-header h4').textContent = `Episode ${num}`;
        });
    }
};

window.removePhoto = (photoId) => {
    document.getElementById(photoId).remove();
    photosContainer.querySelectorAll('.episode-card').forEach((card, index) => {
        const num = index + 1;
        card.setAttribute('data-number', num);
        card.querySelector('.card-header h4').textContent = `Photo ${num}`;
    });
};

let seasonCount = 0;
let episodeCount = 0;
addSeasonBtn.addEventListener('click', () => {
    seasonCount++;
    const displayNumber = seasonsContainer.querySelectorAll('.season-card').length + 1;
    const seasonId = `season-${seasonCount}`;
    const seasonHtml = `
        <div class="season-card" id="${seasonId}" data-number="${displayNumber}">
            <div class="card-header">
                <h3>
                    Season ${displayNumber}
                </h3>
                <button 
                    type="button" 
                    class="remove-btn" 
                    onclick="removeSeason('${seasonId}')"
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
    episodeCount++;
    const seasonCard = document.getElementById(seasonId);
    const container = seasonCard.querySelector('.episodes-container');
    const seasonNumber = seasonCard.getAttribute('data-number');
    const displayNumber = container.children.length + 1;
    const episodeId = `ep-${episodeCount}`;

    const epHtml = `
        <div class="episode-card" id="${episodeId}" data-number="${displayNumber}">
            <div class="card-header">
                <h4>
                    Episode ${displayNumber}
                </h4>
                <button 
                    type="button" 
                    class="remove-btn" 
                    onclick="removeEpisode('${episodeId}', '${seasonId}')"
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

// Pictures: load all content lists when tab is clicked
const moviesList = document.getElementById('moviesList');
const seriesList = document.getElementById('seriesList');

const loadContentLists = async () => {
    moviesList.innerHTML = '<div class="content-list-empty">Loading...</div>';
    seriesList.innerHTML = '<div class="content-list-empty">Loading...</div>';

    const result = await window.electronAPI.getAllContent();
    if (!result.success) {
        moviesList.innerHTML = '<div class="content-list-empty">Error loading</div>';
        seriesList.innerHTML = '<div class="content-list-empty">Error loading</div>';
        return;
    }

    moviesList.innerHTML = result.movies.length
        ? result.movies.map(t => `<div class="content-list-item" data-name="${t}">${t}</div>`).join('')
        : '<div class="content-list-empty">No movies found</div>';

    seriesList.innerHTML = result.series.length
        ? result.series.map(t => `<div class="content-list-item" data-name="${t}">${t}</div>`).join('')
        : '<div class="content-list-empty">No series found</div>';
};

// Select a content item from either list
[moviesList, seriesList].forEach(list => {
    list.addEventListener('click', (e) => {
        const item = e.target.closest('.content-list-item');
        if (!item) return;
        document.querySelectorAll('.content-list-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        selectedContentName.value = item.getAttribute('data-name');
    });
});

// Pictures: add photo card logic
let photoCount = 0;
addPhotoBtn.addEventListener('click', () => {
    photoCount++;
    const displayNumber = photosContainer.querySelectorAll('.episode-card').length + 1;
    const photoId = `photo-${photoCount}`;
    const photoHtml = `
        <div class="episode-card" id="${photoId}" data-number="${displayNumber}">
            <div class="card-header">
                <h4>Photo ${displayNumber}</h4>
                <button 
                    type="button" 
                    class="remove-btn" 
                    onclick="removePhoto('${photoId}')"
                >
                    Remove Photo
                </button>
            </div>
            <div class="form-group">
                <label>Image File</label>
                <div class="file-input-group">
                    <input 
                        type="text" 
                        class="photo-path" 
                        id="${photoId}-path" 
                        placeholder="Image path..." 
                        readonly
                    >
                    <button 
                        type="button" 
                        class="browse-btn" 
                        data-input="${photoId}-path"
                    >
                        Browse
                    </button>
                </div>
            </div>
        </div>
    `;
    photosContainer.insertAdjacentHTML('beforeend', photoHtml);
});

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    processBtn.disabled = true;
    processBtn.textContent = 'Processing Content...';
    showStatus('Initializing process...', 'loading');

    try {
        if (currentType === 'pictures') {
            const contentName = selectedContentName.value;
            if (!contentName) throw new Error('Please select a movie or series from the search results.');

            const imagePaths = [];
            document.querySelectorAll('.photo-path').forEach(input => {
                if (!input.value) throw new Error('All photo slots must have an image selected.');
                imagePaths.push(input.value);
            });

            if (imagePaths.length === 0) throw new Error('Please add at least one photo.');

            const result = await window.electronAPI.processPictures({ contentName, imagePaths });
            if (result.success) {
                showStatus('Pictures processed and uploaded successfully!', 'success');
            } else {
                throw new Error(result.error || 'Processing failed');
            }
        } else {
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
                        files.episodes[epKey] = { video: videoValue };
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
                throw new Error(result.error || 'Processing failed');
            }
        }
    } catch (err) {
        statusMessage.style.display = 'none';
        showErrorModal(err.message);
    } finally {
        processBtn.disabled = false;
        processBtn.textContent = 'Process and Upload';
    }
});
