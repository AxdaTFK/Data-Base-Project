const logoutButton = document.getElementById('logout');

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        return null;
    }
}

function getCover(songId) {
    return localStorage.getItem('cover-' + songId);
}

function getPlays(songId) {
    return Number(localStorage.getItem('plays-' + songId)) || 0;
}

function addPlay(songId) {
    if (songId) {
        localStorage.setItem('plays-' + songId, getPlays(songId) + 1);
    }
}

if (logoutButton) {
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('user');
    });
}
