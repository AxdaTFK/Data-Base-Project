const statisticCards = document.querySelectorAll('.statistic-card');
const songsById = {};
const artistsById = {};

function getWeekStart() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return start.getTime();
}

function getMostFrequent(values) {
    const counts = {};
    let best = null;

    values.forEach(function (value) {
        counts[value] = (counts[value] || 0) + 1;
        if (best === null || counts[value] > counts[best]) best = value;
    });

    return best;
}

function formatHour(hour) {
    const suffix = hour % 24 >= 12 ? 'pm' : 'am';
    return (hour % 12 || 12) + ':00' + suffix;
}

function setBoxText(card, text) {
    const box = card.querySelector('.data-box');
    box.textContent = text;
    box.style.fontSize = text.length > 8 ? '12px' : '';
}

function setBar(card, percent) {
    card.querySelector('.weekly-bar-fill').style.width = Math.min(percent, 95) + '%';
}

function renderStatistics() {
    const user = getStoredUser();
    if (!user || statisticCards.length < 5) return;

    const weekStart = getWeekStart();
    const monthStart = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const plays = getHistory().filter(function (play) {
        return songsById[play.song];
    });

    const allDays = new Set();
    const weekDays = new Set();
    let totalSeconds = 0;
    let weekSeconds = 0;
    let monthSeconds = 0;

    plays.forEach(function (play) {
        const day = new Date(play.time).toDateString();
        const duration = songsById[play.song].duration;

        allDays.add(day);
        totalSeconds += duration;

        if (play.time >= weekStart) {
            weekDays.add(day);
            weekSeconds += duration;
        }
        if (play.time >= monthStart) monthSeconds += duration;
    });

    const totalMinutes = Math.round(totalSeconds / 60);
    const monthMinutes = Math.round(monthSeconds / 60);

    statisticCards[0].querySelector('.card-title').textContent = allDays.size + (allDays.size === 1 ? ' día' : ' días');
    setBar(statisticCards[0], (weekDays.size / 7) * 100);

    statisticCards[1].querySelector('.card-title').textContent = totalMinutes + (totalMinutes === 1 ? ' minuto' : ' minutos');
    statisticCards[1].querySelector('.card-description').textContent = 'El último mes escuchaste ' + monthMinutes + ' minutos';
    setBar(statisticCards[1], monthSeconds > 0 ? (weekSeconds / monthSeconds) * 100 : 0);

    if (plays.length === 0) {
        setBoxText(statisticCards[2], '-');
    } else {
        const slot = getMostFrequent(plays.map(function (play) {
            return Math.floor(new Date(play.time).getHours() / 2) * 2;
        }));
        const slotBox = statisticCards[2].querySelector('.data-box');
        slotBox.style.fontSize = '';
        slotBox.innerHTML = formatHour(slot) + '<br>' + formatHour(slot + 2);
    }

    const genres = plays.map(function (play) {
        return songsById[play.song].genre;
    }).filter(Boolean);
    setBoxText(statisticCards[3], genres.length > 0 ? getMostFrequent(genres) : 'Sin datos');

    const artists = plays.map(function (play) {
        return artistsById[songsById[play.song].artist_idartist];
    }).filter(Boolean);
    setBoxText(statisticCards[4], artists.length > 0 ? getMostFrequent(artists) : '-');
}

async function loadStatistics() {
    try {
        const songsResponse = await fetch(`${API_URL}/songs`);
        const artistsResponse = await fetch(`${API_URL}/artists`);

        if (!songsResponse.ok || !artistsResponse.ok) {
            throw new Error('The server answered with an error');
        }

        const songs = await songsResponse.json();
        const artists = await artistsResponse.json();

        songs.forEach(function (song) {
            songsById[song.idsong] = song;
        });

        artists.forEach(function (artist) {
            artistsById[artist.idartist] = artist.name;
        });

        renderStatistics();

    } catch (error) {
        console.error('Error getting statistics:', error);
    }
}

if (statisticCards.length > 0) {
    loadStatistics();
}
