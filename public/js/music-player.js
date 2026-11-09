const songList = document.getElementById('song-list');
const searchInput = document.getElementById('search-input');
const playerInfo = document.getElementById('song-info');
const isErrorPage = window.location.pathname.includes('home-error');
const addPlaylistIcon = document.getElementById('add-to-library-icon');
const playButton = document.getElementById('play-button');
const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');
const shuffleButton = document.getElementById('shuffle-button');
const repeatButton = document.getElementById('repeat-button');
const progressBar = document.getElementById('progress-control');
const volumeBar = document.getElementById('volume-control');
const currentTimeLabel = document.getElementById('current-time');
const remainingTimeLabel = document.getElementById('remaining-time');
const audioPlayer = new Audio();
audioPlayer.preload = 'none';
audioPlayer.volume = volumeBar ? Number(volumeBar.value) / 100 : 0.5;

let allSongs = [];
let visibleSongs = [];
let playingSongId = null;
const favoriteSongs = new Set();
const artistNames = {};

function getArtistName(song) {
    return artistNames[song.artist_idartist] || 'Desconocido';
}

function renderSongs(songs) {
    visibleSongs = songs;
    songList.innerHTML = '';

    if (songs.length === 0) {
        songList.innerHTML = '<li>No hay canciones</li>';
        return;
    }

    songs.forEach(function (song, index) {
        const item = document.createElement('li');
        item.className = 'song';
        item.setAttribute('data-identificador-cancion', song.idsong);

        const fields = [
            ['song-number', index + 1],
            ['song-cover', ''],
            ['song-title', song.name],
            ['song-artist', getArtistName(song)],
            ['song-duration', formatDuration(song.duration)]
        ];

        fields.forEach(function (field) {
            const span = document.createElement('span');
            span.className = field[0];
            span.textContent = field[1];

            if (field[0] === 'song-cover') {
                const cover = getCover(song.idsong);
                const note = document.createElement('img');
                note.src = cover || 'assets/music.png';
                note.alt = '';
                if (cover) note.style.cssText = 'width:55px;height:55px;object-fit:cover;border-radius:3px;';
                span.appendChild(note);
            }

            item.appendChild(span);
        });

        const actions = document.createElement('div');
        actions.className = 'song-actions';

        const icons = [
            ['favorite-action', favoriteSongs.has(song.idsong) ? 'assets/heart.png' : 'assets/favorite.png', 'Favorita'],
            ['save-action', 'assets/inspection.png', 'Reseña'],
            ['more-options-action', 'assets/more.png', 'Más opciones']
        ];

        icons.forEach(function (icon) {
            const image = document.createElement('img');
            image.className = icon[0];
            image.src = icon[1];
            image.alt = icon[2];
            image.style.cursor = 'pointer';
            actions.appendChild(image);
        });

        item.appendChild(actions);
        songList.appendChild(item);
    });

    highlightPlayingSong();
}

function renderLibrary(playlists, songCounts) {
    libraryList.innerHTML = '';

    if (playlists.length === 0) {
        libraryList.innerHTML = '<div class="library-item"><div class="item-text"><span class="item-name">Aún no tienes playlists</span></div></div>';
        return;
    }

    playlists.forEach(function (playlist, index) {
        const item = document.createElement('div');
        item.className = 'library-item';

        const iconBox = document.createElement('span');
        iconBox.className = 'item-icon';
        const icon = document.createElement('img');
        icon.src = 'assets/heart.png';
        icon.alt = '';
        iconBox.appendChild(icon);

        const textBox = document.createElement('div');
        textBox.className = 'item-text';
        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';
        nameSpan.textContent = playlist.name;
        const detailSpan = document.createElement('span');
        detailSpan.className = 'item-detail';
        detailSpan.textContent = 'Playlists - ' + songCounts[index] + ' canciones';
        textBox.appendChild(nameSpan);
        textBox.appendChild(detailSpan);

        const pin = document.createElement('img');
        pin.className = 'pin-icon';
        pin.src = 'assets/push-pin.png';
        pin.alt = 'Fijada';

        item.appendChild(iconBox);
        item.appendChild(textBox);
        item.appendChild(pin);
        libraryList.appendChild(item);
    });
}

async function loadHome(user) {
    try {
        const songsResponse = await fetch(`${API_URL}/songs`);
        const artistsResponse = await fetch(`${API_URL}/artists`);
        const playlistsResponse = await fetch(`${API_URL}/users/${user.iduser}/playlists`);

        if (!songsResponse.ok || !artistsResponse.ok || !playlistsResponse.ok) {
            throw new Error('The server answered with an error');
        }

        allSongs = await songsResponse.json();
        const artists = await artistsResponse.json();
        const playlists = await playlistsResponse.json();

        artists.forEach(function (artist) {
            artistNames[artist.idartist] = artist.name;
        });

        renderSongs(allSongs);
        selectSong(0);

        const songCounts = [];
        for (const playlist of playlists) {
            const countResponse = await fetch(`${API_URL}/playlists/${playlist.idplaylist}/songs`);
            const playlistSongs = await countResponse.json();
            songCounts.push(Array.isArray(playlistSongs) ? playlistSongs.length : 0);
        }

        renderLibrary(playlists, songCounts);

    } catch (error) {
        console.error('Error getting data:', error);
        goTo('home-error.html');
    }
}

let elapsedSeconds = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

function getPlayingPosition() {
    return visibleSongs.findIndex(function (song) {
        return song.idsong === playingSongId;
    });
}

function getPlayingSongForPlays() {
    return playingSongId || currentSongId;
}

function highlightPlayingSong() {
    if (!songList) return;

    Array.from(songList.children).forEach(function (item) {
        const songId = Number(item.getAttribute('data-identificador-cancion'));
        item.classList.toggle('selected-song', songId === playingSongId);
    });
}

function updateProgress() {
    if (!progressBar) return;

    const duration = Number(progressBar.max);
    const percent = duration > 0 ? (elapsedSeconds / duration) * 100 : 0;

    progressBar.value = elapsedSeconds;
    progressBar.style.setProperty('--porcentaje-relleno', percent + '%');

    if (currentTimeLabel) currentTimeLabel.textContent = formatDuration(elapsedSeconds);
    if (remainingTimeLabel) remainingTimeLabel.textContent = '-' + formatDuration(duration - elapsedSeconds);
}

function updatePlayButton() {
    if (!playButton) return;

    playButton.src = isPlaying ? 'assets/pause-button.png' : 'assets/play-button.png';
    playButton.alt = isPlaying ? 'Pausar' : 'Reproducir';
}

function playAudio() {
    audioPlayer.play().catch(function (error) {
        if (error.name === 'AbortError' || audioPlayer.error) return;
        console.error('Error playing audio:', error);
        showMessage('No se pudo reproducir esta canción.', true);
    });
}

function selectSong(index) {
    if (visibleSongs.length === 0) return;

    const resumePlayback = isPlaying;
    audioPlayer.pause();

    const position = (index + visibleSongs.length) % visibleSongs.length;
    const song = visibleSongs[position];
    playingSongId = song.idsong;

    if (playerInfo) {
        const playerText = playerInfo.querySelector('div');
        playerText.textContent = '';
        playerText.append(song.name, document.createElement('br'), getArtistName(song) + ' - ' + (song.album || 'Sin álbum'));
    }

    audioPlayer.src = `${API_URL}/songs/${song.idsong}/audio`;
    audioPlayer.load();
    if (progressBar) progressBar.max = song.duration;
    elapsedSeconds = 0;
    updateProgress();
    highlightPlayingSong();

    if (resumePlayback) {
        addPlay(playingSongId);
        playAudio();
    }
}

function changeSong(step) {
    if (visibleSongs.length === 0) return;

    let position = getPlayingPosition() + step;

    if (isShuffle && visibleSongs.length > 1) {
        position = Math.floor(Math.random() * visibleSongs.length);
    }

    selectSong(position);
}

function togglePlay() {
    if (audioPlayer.paused) {
        addPlay(getPlayingSongForPlays());
        playAudio();
    } else {
        audioPlayer.pause();
    }
}

audioPlayer.addEventListener('play', function () {
    isPlaying = true;
    updatePlayButton();
});

audioPlayer.addEventListener('pause', function () {
    isPlaying = false;
    updatePlayButton();
});

audioPlayer.addEventListener('timeupdate', function () {
    elapsedSeconds = Math.floor(audioPlayer.currentTime);
    if (progressBar && Number.isFinite(audioPlayer.duration)) {
        progressBar.max = Math.ceil(audioPlayer.duration);
    }
    updateProgress();
});

audioPlayer.addEventListener('ended', function () {
    if (!isRepeat) changeSong(1);
});

audioPlayer.addEventListener('error', function () {
    if (!audioPlayer.src) return;
    isPlaying = false;
    updatePlayButton();
    showMessage('No hay audio cargado para esta canción.', true);
});

function toggleModeButton(button, isActive) {
    button.style.filter = isActive ? 'drop-shadow(0 0 6px #b266ff)' : '';
}

if (playButton) {
    playButton.addEventListener('click', togglePlay);
}

if (previousButton) {
    previousButton.addEventListener('click', function () {
        changeSong(-1);
    });
}

if (nextButton) {
    nextButton.addEventListener('click', function () {
        changeSong(1);
    });
}

if (shuffleButton) {
    shuffleButton.addEventListener('click', function () {
        isShuffle = !isShuffle;
        toggleModeButton(shuffleButton, isShuffle);
    });
}

if (repeatButton) {
    repeatButton.addEventListener('click', function () {
        isRepeat = !isRepeat;
        audioPlayer.loop = isRepeat;
        toggleModeButton(repeatButton, isRepeat);
    });
}

if (progressBar) {
    progressBar.addEventListener('input', function () {
        elapsedSeconds = Number(progressBar.value);
        if (Number.isFinite(audioPlayer.duration)) {
            audioPlayer.currentTime = elapsedSeconds;
        }
        updateProgress();
    });
}

if (volumeBar) {
    volumeBar.addEventListener('input', function () {
        const percent = (volumeBar.value / volumeBar.max) * 100;
        volumeBar.style.setProperty('--porcentaje-relleno', percent + '%');
        audioPlayer.volume = percent / 100;
    });
}

if (songList && !isErrorPage) {
    const homeUser = getStoredUser();

    if (!homeUser) {
        goTo('login.html');
    } else {
        loadHome(homeUser);

        searchInput.addEventListener('input', function () {
            const text = searchInput.value.toLowerCase();
            const found = allSongs.filter(function (song) {
                return song.name.toLowerCase().includes(text) || getArtistName(song).toLowerCase().includes(text);
            });
            renderSongs(found);
        });

        songList.addEventListener('click', function (event) {
            const item = event.target.closest('.song');
            if (!item) return;

            const songId = Number(item.getAttribute('data-identificador-cancion'));

            if (event.target.classList.contains('favorite-action')) {
                if (favoriteSongs.has(songId)) {
                    favoriteSongs.delete(songId);
                    event.target.src = 'assets/favorite.png';
                } else {
                    favoriteSongs.add(songId);
                    event.target.src = 'assets/heart.png';
                }
            } else if (event.target.classList.contains('save-action')) {
                goTo('reviews.html?song=' + songId);
            } else if (event.target.classList.contains('more-options-action')) {
                openSongMenu(event.target, songId, homeUser);
            } else {
                selectSong(Array.from(songList.children).indexOf(item));
            }
        });

        if (addPlaylistIcon) {
            addPlaylistIcon.addEventListener('click', async function () {
                const playlistName = await askText('Nueva playlist', 'Nombre de la playlist', 'Crear');
                if (!playlistName) return;

                try {
                    const response = await sendJson(`/playlists`, 'POST', { name: playlistName, user_iduser: homeUser.iduser });

                    const result = await response.json();

                    if (!response.ok) {
                        showMessage(result.error || 'No se pudo crear la playlist.', true);
                        return;
                    }

                    showMessage('Playlist creada.', false);
                    await refreshLibrary(homeUser);

                } catch (error) {
                    console.error('Error:', error);
                    showMessage('Error al crear la playlist.', true);
                }
            });
        }
    }
}

let currentSongId = null;
