// Getting the elements from the DOM
const form = document.getElementById('mediaForm');
const movieTab = document.getElementById('movieTab');
const seriesTab = document.getElementById('seriesTab');
const picturesTab = document.getElementById('picturesTab');
const manageTab = document.getElementById('manageTab');
const movieSection = document.getElementById('movieSection');
const seriesSection = document.getElementById('seriesSection');
const picturesSection = document.getElementById('picturesSection');
const manageSection = document.getElementById('manageSection');
const commonFields = document.getElementById('commonFields');
const processBtn = document.getElementById('processBtn');
const statusMessage = document.getElementById('processStatus');
const seasonsContainer = document.getElementById('seasonsContainer');
const addSeasonBtn = document.getElementById('addSeason');
const errorModal = document.getElementById('errorModal');
const errorModalMessage = document.getElementById('errorModalMessage');
const closeModalBtn = document.getElementById('closeModalBtn');
const confirmationModal = document.getElementById('confirmModal');
const confirmationModalMessage = document.getElementById('confirmModalMessage');
const confirmOkBtn = document.getElementById('confirmOkBtn');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const backBtn = document.getElementById('backBtn');
const selectedContentName = document.getElementById('selectedContentName');
const photosContainer = document.getElementById('photosContainer');
const addPhotoBtn = document.getElementById('addPhoto');

// Manage elements
const manageMoviesTab = document.getElementById('manageMoviesTab');
const manageSeriesTab = document.getElementById('manageSeriesTab');
const managePicturesTab = document.getElementById('managePicturesTab');
const manageContentList = document.getElementById('manageContentList');
const manageEditForm = document.getElementById('manageEditForm');
const editItemId = document.getElementById('editItemId');

// Movie edit inputs
const movieEditFields = document.getElementById('movieEditFields');
const editMovieTitle = document.getElementById('editMovieTitle');
const editMovieYear = document.getElementById('editMovieYear');
const editMovieDescription = document.getElementById('editMovieDescription');
const editMovieGenresContainer = document.getElementById('editMovieGenresContainer');
const editMovieCast = document.getElementById('editMovieCast');
const editMovieDuration = document.getElementById('editMovieDuration');
const editMovieIsForKids = document.getElementById('editMovieIsForKids');

// Series edit inputs
const seriesEditFields = document.getElementById('seriesEditFields');
const editSeriesTitle = document.getElementById('editSeriesTitle');
const editSeriesYear = document.getElementById('editSeriesYear');
const editSeriesDescription = document.getElementById('editSeriesDescription');
const editSeriesGenresContainer = document.getElementById('editSeriesGenresContainer');
const editSeriesCast = document.getElementById('editSeriesCast');
const editSeriesIsForKids = document.getElementById('editSeriesIsForKids');
const editSeriesSeasonsContainer = document.getElementById('editSeriesSeasonsContainer');

// Pictures edit inputs
const picturesEditFields = document.getElementById('picturesEditFields');
const editPicturesContentName = document.getElementById('editPicturesContentName');

// Action buttons
const saveEditBtn = document.getElementById('saveEditBtn');
const deleteBtn = document.getElementById('deleteBtn');

let currentType = 'movie';
let currentManageType = 'movie';
let manageItems = [];
let confirmationCallback = null;

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

const showConfirmationModal = (message, onConfirm) => {
    confirmationModalMessage.textContent = message;
    confirmationCallback = typeof onConfirm === 'function' ? onConfirm : null;
    confirmationModal.style.display = 'flex';
};

const closeConfirmationModal = () => {
    confirmationModal.style.display = 'none';
    confirmationCallback = null;
};

closeModalBtn.addEventListener('click', closeErrorModal);
confirmCancelBtn.addEventListener('click', closeConfirmationModal);
confirmOkBtn.addEventListener('click', async () => {
    const callback = confirmationCallback;
    if (typeof callback === 'function') {
        closeConfirmationModal();
        await callback();
    }
});

// Content type changer
movieTab.addEventListener('click', () => {
    currentType = 'movie';
    movieTab.classList.add('active');
    seriesTab.classList.remove('active');
    picturesTab.classList.remove('active');
    manageTab.classList.remove('active');
    form.style.display = 'flex';
    manageSection.style.display = 'none';
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
    manageTab.classList.remove('active');
    form.style.display = 'flex';
    manageSection.style.display = 'none';
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
    manageTab.classList.remove('active');
    form.style.display = 'flex';
    manageSection.style.display = 'none';
    commonFields.style.display = 'none';
    movieSection.style.display = 'none';
    seriesSection.style.display = 'none';
    picturesSection.style.display = 'block';
    loadContentLists();
});

manageTab.addEventListener('click', () => {
    currentType = 'manage';
    manageTab.classList.add('active');
    movieTab.classList.remove('active');
    seriesTab.classList.remove('active');
    picturesTab.classList.remove('active');
    form.style.display = 'none';
    manageSection.style.display = 'block';
    loadManageList();
});

manageMoviesTab.addEventListener('click', () => {
    currentManageType = 'movie';
    manageMoviesTab.classList.add('active');
    manageSeriesTab.classList.remove('active');
    managePicturesTab.classList.remove('active');
    loadManageList();
});

manageSeriesTab.addEventListener('click', () => {
    currentManageType = 'series';
    manageSeriesTab.classList.add('active');
    manageMoviesTab.classList.remove('active');
    managePicturesTab.classList.remove('active');
    loadManageList();
});

managePicturesTab.addEventListener('click', () => {
    currentManageType = 'pictures';
    managePicturesTab.classList.add('active');
    manageMoviesTab.classList.remove('active');
    manageSeriesTab.classList.remove('active');
    loadManageList();
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

// 'Requires' replacement (deprecated xd)

const validateMovie = () => {
    const title       = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const year        = document.getElementById('year').value.trim();
    const cast        = document.getElementById('cast').value.trim();
    const thumbnail   = document.getElementById('mainThumbnail').value.trim();
    const video       = document.getElementById('movieVideo').value.trim();
    const duration    = document.getElementById('duration').value.trim();

    if (!title)       throw new Error('Movie: Title is required.');
    if (!description) throw new Error('Movie: Description is required.');
    if (!year || isNaN(parseInt(year))) throw new Error('Movie: A valid Release Year is required.');
    if (!cast)        throw new Error('Movie: Cast is required.');
    if (!thumbnail)   throw new Error('Movie: Main Thumbnail is required.');
    if (!video)       throw new Error('Movie: Video file is required.');
    if (!duration || isNaN(parseInt(duration))) throw new Error('Movie: Duration is required (select a video to auto-fill it).');
};

const validateSeries = () => {
    const title       = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const year        = document.getElementById('year').value.trim();
    const cast        = document.getElementById('cast').value.trim();
    const thumbnail   = document.getElementById('mainThumbnail').value.trim();

    if (!title)       throw new Error('Series: Title is required.');
    if (!description) throw new Error('Series: Description is required.');
    if (!year || isNaN(parseInt(year))) throw new Error('Series: A valid Release Year is required.');
    if (!cast)        throw new Error('Series: Cast is required.');
    if (!thumbnail)   throw new Error('Series: Main Thumbnail is required.');

    const seasonCards = document.querySelectorAll('.season-card');
    if (seasonCards.length === 0) throw new Error('Series: At least one season is required.');

    seasonCards.forEach(s => {
        const seasonNumber = s.getAttribute('data-number');
        const episodeCards = s.querySelectorAll('.episode-card');
        if (episodeCards.length === 0) throw new Error(`Series: Season ${seasonNumber} must have at least one episode.`);

        episodeCards.forEach(ep => {
            const epNumber    = ep.getAttribute('data-number');
            const epTitle     = ep.querySelector('.ep-title').value.trim();
            const epVideo     = ep.querySelector('.ep-video').value.trim();
            const epDuration  = ep.querySelector('.ep-duration').value.trim();

            if (!epTitle)    throw new Error(`Series: Season ${seasonNumber}, Episode ${epNumber} is missing a title.`);
            if (!epVideo)    throw new Error(`Series: Season ${seasonNumber}, Episode ${epNumber} is missing a video file.`);
            if (!epDuration || isNaN(parseInt(epDuration)))
                throw new Error(`Series: Season ${seasonNumber}, Episode ${epNumber} is missing a duration (select a video to auto-fill it).`);
        });
    });
};

const validatePictures = () => {
    const contentName = selectedContentName.value;
    if (!contentName) throw new Error('Pictures: Please select a movie or series from the lists.');

    const photoPaths = Array.from(document.querySelectorAll('.photo-path'));
    if (photoPaths.length === 0) throw new Error('Pictures: Please add at least one photo.');

    photoPaths.forEach((input, idx) => {
        if (!input.value.trim()) throw new Error(`Pictures: Photo ${idx + 1} has no image selected.`);
    });
};

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        // Only checks the corresponding tab
        if (currentType === 'movie')    validateMovie();
        if (currentType === 'series')   validateSeries();
        if (currentType === 'pictures') validatePictures();
    } catch (validationErr) {
        showErrorModal('Data missing.');
        return;
    }

    processBtn.disabled = true;
    processBtn.textContent = 'Processing Content...';
    showStatus('Initializing process...', 'loading');

    try {
        if (currentType === 'pictures') {
            const contentName = selectedContentName.value;
            const imagePaths  = Array.from(document.querySelectorAll('.photo-path')).map(i => i.value);

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
                title:        document.getElementById('title').value.trim(),
                description:  document.getElementById('description').value.trim(),
                genres:       selectedGenres,
                cast:         document.getElementById('cast').value.split(',').map(c => c.trim()).filter(Boolean),
                release_year: parseInt(document.getElementById('year').value),
                is_for_kids:  document.getElementById('isForKids').checked
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
                        video:     document.getElementById('movieVideo').value,
                        thumbnail: document.getElementById('mainThumbnail').value
                    }
                };
            } else {
                // series
                const seasons = [];
                const files   = { thumbnail: document.getElementById('mainThumbnail').value, episodes: {} };

                document.querySelectorAll('.season-card').forEach(s => {
                    const seasonNumber = s.getAttribute('data-number');
                    const episodes     = [];

                    s.querySelectorAll('.episode-card').forEach(ep => {
                        const epNumber   = ep.getAttribute('data-number');
                        const epKey      = `s${seasonNumber}e${epNumber}`;
                        const titleValue = ep.querySelector('.ep-title').value;
                        const descValue  = ep.querySelector('.ep-description').value;
                        const durValue   = ep.querySelector('.ep-duration').value;
                        const videoValue = ep.querySelector('.ep-video').value;

                        episodes.push({
                            episode_number: parseInt(epNumber),
                            title:          titleValue,
                            description:    descValue || 'No description provided.',
                            duration:       parseInt(durValue)
                        });
                        files.episodes[epKey] = { video: videoValue };
                    });

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
        processBtn.textContent = 'Process & Upload';
    }
});

// Manage Section Logic

const loadManageList = async () => {
    manageContentList.innerHTML = '<div class="content-list-empty">Loading...</div>';
    manageEditForm.style.display = 'none';
    
    let result;
    if (currentManageType === 'movie') {
        result = await window.electronAPI.getManageMovies();
    } else if (currentManageType === 'series') {
        result = await window.electronAPI.getManageSeries();
    } else {
        result = await window.electronAPI.getManagePictures();
    }
    
    if (!result.success) {
        manageContentList.innerHTML = `<div class="content-list-empty">Error: ${result.error}</div>`;
        return;
    }
    
    manageItems = result.data || [];
    
    if (manageItems.length === 0) {
        manageContentList.innerHTML = '<div class="content-list-empty">No items found</div>';
        return;
    }
    
    manageContentList.innerHTML = manageItems.map(item => {
        const title = currentManageType === 'pictures' ? item.content_name : item.title;
        return `<div class="content-list-item" data-id="${item._id}">${title}</div>`;
    }).join('');
};

// Select item to edit
manageContentList.addEventListener('click', (e) => {
    const item = e.target.closest('.content-list-item');
    if (!item) return;
    
    manageContentList.querySelectorAll('.content-list-item').forEach(el => el.classList.remove('selected'));
    item.classList.add('selected');
    
    const id = item.getAttribute('data-id');
    const selectedItem = manageItems.find(i => i._id === id);
    if (selectedItem) {
        populateEditForm(selectedItem);
    }
});

const populateEditForm = (item) => {
    editItemId.value = item._id;
    manageEditForm.style.display = 'block';
    
    if (currentManageType === 'movie') {
        movieEditFields.style.display = 'block';
        seriesEditFields.style.display = 'none';
        picturesEditFields.style.display = 'none';
        
        editMovieTitle.value = item.title || '';
        editMovieYear.value = item.release_year || '';
        editMovieDescription.value = item.description || '';
        editMovieCast.value = (item.cast || []).join(', ');
        editMovieDuration.value = item.duration || '';
        editMovieIsForKids.checked = !!item.is_for_kids;
        
        const genres = item.genres || [];
        editMovieGenresContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = genres.includes(cb.value);
        });
        
    } else if (currentManageType === 'series') {
        movieEditFields.style.display = 'none';
        seriesEditFields.style.display = 'block';
        picturesEditFields.style.display = 'none';
        
        editSeriesTitle.value = item.title || '';
        editSeriesYear.value = item.release_year || '';
        editSeriesDescription.value = item.description || '';
        editSeriesCast.value = (item.cast || []).join(', ');
        editSeriesIsForKids.checked = !!item.is_for_kids;
        
        const genres = item.genres || [];
        editSeriesGenresContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = genres.includes(cb.value);
        });
        
        // Populate seasons and episodes
        editSeriesSeasonsContainer.innerHTML = '';
        (item.seasons || []).forEach(season => {
            const seasonId = `edit-season-${season.season_number}`;
            let episodesHtml = '';
            
            (season.episodes || []).forEach(episode => {
                const epId = `edit-ep-${season.season_number}-${episode.episode_number}`;
                episodesHtml += `
                    <div class="episode-card" id="${epId}" data-number="${episode.episode_number}">
                        <div class="card-header">
                            <h4>Episode ${episode.episode_number}</h4>
                        </div>
                        <div class="form-group">
                            <label>Episode Title</label>
                            <input type="text" class="edit-ep-title" value="${episode.title || ''}" placeholder="Episode title...">
                        </div>
                        <div class="form-group" style="margin-top: 0.6rem;">
                            <label>Description</label>
                            <textarea class="edit-ep-description" placeholder="Episode description...">${episode.description || ''}</textarea>
                        </div>
                        <div class="form-group" style="margin-top: 0.6rem;">
                            <label>Duration (seconds)</label>
                            <input type="number" class="edit-ep-duration" value="${episode.duration || ''}">
                        </div>
                    </div>
                `;
            });
            
            const seasonHtml = `
                <div class="season-card" id="${seasonId}" data-number="${season.season_number}">
                    <div class="card-header">
                        <h3>Season ${season.season_number}</h3>
                    </div>
                    <div class="episodes-container">
                        ${episodesHtml}
                    </div>
                </div>
            `;
            editSeriesSeasonsContainer.insertAdjacentHTML('beforeend', seasonHtml);
        });
        
    } else if (currentManageType === 'pictures') {
        movieEditFields.style.display = 'none';
        seriesEditFields.style.display = 'none';
        picturesEditFields.style.display = 'block';
        
        editPicturesContentName.value = item.content_name || '';
    }
};

// Save changes handler
saveEditBtn.addEventListener('click', async () => {
    const id = editItemId.value;
    if (!id) return;
    
    saveEditBtn.disabled = true;
    saveEditBtn.textContent = 'Saving Changes...';
    showStatus('Saving changes to database...', 'loading');
    
    try {
        let result;
        if (currentManageType === 'movie') {
            const selectedGenres = Array.from(editMovieGenresContainer.querySelectorAll('input:checked'))
                .map(cb => cb.value);
            const metadata = {
                title: editMovieTitle.value,
                release_year: parseInt(editMovieYear.value),
                description: editMovieDescription.value,
                genres: selectedGenres,
                cast: editMovieCast.value.split(',').map(c => c.trim()),
                duration: parseInt(editMovieDuration.value),
                is_for_kids: editMovieIsForKids.checked
            };
            if (!metadata.title || isNaN(metadata.release_year)) {
                throw new Error('Title and a valid Release Year are required.');
            }
            result = await window.electronAPI.updateMovie({ id, metadata });
        } else if (currentManageType === 'series') {
            const selectedGenres = Array.from(editSeriesGenresContainer.querySelectorAll('input:checked'))
                .map(cb => cb.value);
            
            const seasons = [];
            document.querySelectorAll('#editSeriesSeasonsContainer .season-card').forEach(sCard => {
                const seasonNumber = parseInt(sCard.getAttribute('data-number'));
                const episodes = [];
                sCard.querySelectorAll('.episode-card').forEach(epCard => {
                    const episodeNumber = parseInt(epCard.getAttribute('data-number'));
                    episodes.push({
                        episode_number: episodeNumber,
                        title: epCard.querySelector('.edit-ep-title').value,
                        description: epCard.querySelector('.edit-ep-description').value,
                        duration: parseInt(epCard.querySelector('.edit-ep-duration').value)
                    });
                });
                seasons.push({ season_number: seasonNumber, episodes });
            });
            
            const metadata = {
                title: editSeriesTitle.value,
                release_year: parseInt(editSeriesYear.value),
                description: editSeriesDescription.value,
                genres: selectedGenres,
                cast: editSeriesCast.value.split(',').map(c => c.trim()),
                is_for_kids: editSeriesIsForKids.checked,
                seasons
            };
            if (!metadata.title || isNaN(metadata.release_year)) {
                throw new Error('Title and a valid Release Year are required.');
            }
            result = await window.electronAPI.updateSeries({ id, metadata });
        } else if (currentManageType === 'pictures') {
            const content_name = editPicturesContentName.value;
            if (!content_name) {
                throw new Error('Content Reference Name is required.');
            }
            result = await window.electronAPI.updatePicture({ id, metadata: { content_name } });
        }
        
        if (result.success) {
            showStatus('Changes saved successfully!', 'success');
            await loadManageList();
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 2000);
        } else {
            throw new Error(result.error || 'Failed to save changes');
        }
    } catch (err) {
        statusMessage.style.display = 'none';
        showErrorModal(err.message);
    } finally {
        saveEditBtn.disabled = false;
        saveEditBtn.textContent = 'Save Changes';
    }
});

// Delete handler
deleteBtn.addEventListener('click', () => {
    const id = editItemId.value;
    if (!id) return;
    
    const confirmMessage = `Are you sure you want to delete this ${currentManageType}? This will delete it from the database and remove all its files from the CDN.`;
    showConfirmationModal(confirmMessage, async () => {
        deleteBtn.disabled = true;
        deleteBtn.textContent = 'Deleting...';
        showStatus('Deleting from DB and CDN...', 'loading');
        
        try {
            let result;
            if (currentManageType === 'movie') {
                result = await window.electronAPI.deleteMovie(id);
            } else if (currentManageType === 'series') {
                result = await window.electronAPI.deleteSeries(id);
            } else if (currentManageType === 'pictures') {
                result = await window.electronAPI.deletePicture(id);
            }
            
            if (result.success) {
                showStatus('Content deleted successfully from both DB and CDN!', 'success');
                await loadManageList();
                setTimeout(() => {
                    statusMessage.style.display = 'none';
                }, 2000);
            } else {
                throw new Error(result.error || 'Deletion failed');
            }
        } catch (err) {
            statusMessage.style.display = 'none';
            showErrorModal(err.message);
        } finally {
            deleteBtn.disabled = false;
            deleteBtn.textContent = 'Delete';
        }
    });
});
