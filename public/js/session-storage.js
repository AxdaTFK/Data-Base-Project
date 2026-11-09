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

function getHistory() {
    const user = getStoredUser();
    if (!user) return [];

    try {
        return JSON.parse(localStorage.getItem('history-' + user.iduser)) || [];
    } catch (error) {
        return [];
    }
}

function saveHistory(songId) {
    const user = getStoredUser();
    if (!user) return;

    const history = getHistory();
    history.push({ song: Number(songId), time: Date.now() });
    localStorage.setItem('history-' + user.iduser, JSON.stringify(history.slice(-1000)));
}

function addPlay(songId) {
    if (songId) {
        localStorage.setItem('plays-' + songId, getPlays(songId) + 1);
        saveHistory(songId);

        if (typeof renderStatistics === 'function') renderStatistics();
    }
}

if (logoutButton) {
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('user');
    });
}
