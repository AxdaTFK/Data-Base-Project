const libraryList = document.getElementById('library-list');

let songMenu = null;

function closeSongMenu() {
    if (songMenu) {
        songMenu.remove();
        songMenu = null;
    }
}

function placeSongMenu(anchor) {
    const rect = anchor.getBoundingClientRect();
    songMenu.style.top = (rect.bottom + 6) + 'px';
    songMenu.style.left = Math.max(8, rect.right - songMenu.offsetWidth) + 'px';
}

function createMenuItem(text, onClick) {
    const option = document.createElement('div');
    option.textContent = text;
    option.style.cssText = 'padding:10px 18px;white-space:nowrap;border-radius:8px;';

    if (onClick) {
        option.style.cursor = 'pointer';
        option.addEventListener('mouseenter', function () {
            option.style.background = 'rgba(255,255,255,0.18)';
        });
        option.addEventListener('mouseleave', function () {
            option.style.background = 'transparent';
        });
        option.addEventListener('click', onClick);
    } else {
        option.style.opacity = '0.7';
    }
    return option;
}

async function refreshLibrary(user) {
    if (!libraryList) return;

    try {
        const response = await fetch(`${API_URL}/users/${user.iduser}/playlists`);
        const playlists = await response.json();

        const songCounts = [];
        for (const playlist of playlists) {
            const countResponse = await fetch(`${API_URL}/playlists/${playlist.idplaylist}/songs`);
            const playlistSongs = await countResponse.json();
            songCounts.push(Array.isArray(playlistSongs) ? playlistSongs.length : 0);
        }

        renderLibrary(playlists, songCounts);
    } catch (error) {
        console.error('Error updating the library:', error);
    }
}

async function addSongToPlaylist(playlist, songId, user) {
    try {
        const response = await sendJson(`/playlists/${playlist.idplaylist}/songs`, 'POST', { song_idsong: songId });

        const result = await response.json();
        closeSongMenu();

        if (!response.ok) {
            const alreadyAdded = String(result.error).includes('Duplicate');
            showMessage(alreadyAdded ? 'La canción ya está en esta playlist.' : (result.error || 'No se pudo agregar la canción.'), true);
            return;
        }

        showMessage('Canción agregada a ' + playlist.name + '.', false);
        await refreshLibrary(user);

    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al agregar la canción.', true);
    }
}

async function getUserPlaylists(user) {
    const response = await fetch(`${API_URL}/users/${user.iduser}/playlists`);
    const playlists = await response.json();

    if (!response.ok) throw new Error(playlists.error);

    for (const playlist of playlists) {
        const songsResponse = await fetch(`${API_URL}/playlists/${playlist.idplaylist}/songs`);
        const playlistSongs = await songsResponse.json();
        playlist.songIds = songsResponse.ok ? playlistSongs.map(function (song) {
            return song.idsong;
        }) : [];
    }

    return playlists;
}

function renderMenu(anchor, items) {
    if (!songMenu) return;

    songMenu.textContent = '';
    items.forEach(function (item) {
        songMenu.appendChild(createMenuItem(item[0], item[1]));
    });
    placeSongMenu(anchor);
}

function showChoices(anchor, header, playlists, emptyText, onPick) {
    if (playlists.length === 0) {
        renderMenu(anchor, [[emptyText]]);
        return;
    }

    const items = [[header]];
    playlists.forEach(function (playlist) {
        items.push([playlist.name, function () {
            onPick(playlist);
        }]);
    });
    renderMenu(anchor, items);
}

async function removeSongFromPlaylist(playlist, songId, user) {
    try {
        const response = await fetch(`${API_URL}/playlists/${playlist.idplaylist}/songs/${songId}`, {
            method: 'DELETE'
        });

        closeSongMenu();

        if (!response.ok) {
            const result = await response.json();
            showMessage(result.error || 'No se pudo quitar la canción.', true);
            return;
        }

        showMessage('Canción quitada de ' + playlist.name + '.', false);
        await refreshLibrary(user);

    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al quitar la canción.', true);
    }
}

async function moveSongToPlaylist(source, target, songId, user) {
    try {
        const addResponse = await sendJson(`/playlists/${target.idplaylist}/songs`, 'POST', { song_idsong: songId });

        closeSongMenu();

        if (!addResponse.ok) {
            const result = await addResponse.json();
            showMessage(result.error || 'No se pudo mover la canción.', true);
            return;
        }

        const removeResponse = await fetch(`${API_URL}/playlists/${source.idplaylist}/songs/${songId}`, {
            method: 'DELETE'
        });

        if (!removeResponse.ok) {
            showMessage('La canción se agregó a ' + target.name + ' pero no se pudo quitar de ' + source.name + '.', true);
            await refreshLibrary(user);
            return;
        }

        showMessage('Canción movida de ' + source.name + ' a ' + target.name + '.', false);
        await refreshLibrary(user);

    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al mover la canción.', true);
    }
}

async function showSongMenu(anchor, songId, user) {
    renderMenu(anchor, [['Loading...']]);

    try {
        const playlists = await getUserPlaylists(user);
        if (!songMenu) return;

        const withSong = playlists.filter(function (playlist) {
            return playlist.songIds.includes(songId);
        });
        const withoutSong = playlists.filter(function (playlist) {
            return !playlist.songIds.includes(songId);
        });

        const items = [['Agregar a playlist', function () {
            showChoices(anchor, 'Agregar a:', withoutSong, playlists.length === 0 ? 'Aún no tienes playlists' : 'La canción ya está en todas tus playlists', function (playlist) {
                addSongToPlaylist(playlist, songId, user);
            });
        }]];

        if (withSong.length > 0) {
            items.push(['Quitar de la playlist', function () {
                showChoices(anchor, 'Quitar de:', withSong, '', function (playlist) {
                    removeSongFromPlaylist(playlist, songId, user);
                });
            }]);

            items.push(['Mover a otra playlist', function () {
                function chooseTarget(source) {
                    showChoices(anchor, 'Mover a:', withoutSong, 'No tienes otras playlists a las que moverla', function (target) {
                        moveSongToPlaylist(source, target, songId, user);
                    });
                }

                if (withSong.length === 1) {
                    chooseTarget(withSong[0]);
                } else {
                    showChoices(anchor, 'Mover desde:', withSong, '', chooseTarget);
                }
            }]);
        }

        renderMenu(anchor, items);

    } catch (error) {
        console.error('Error getting the playlists:', error);
        closeSongMenu();
        showMessage('Error al obtener las playlists.', true);
    }
}

document.addEventListener('click', function (event) {
    if (!songMenu) return;
    if (event.composedPath().includes(songMenu)) return;
    if (event.target.classList && event.target.classList.contains('more-options-action')) return;
    if (event.target.closest && event.target.closest('#add-to-playlist-button')) return;
    closeSongMenu();
});

window.addEventListener('scroll', function (event) {
    if (event.target !== songMenu) closeSongMenu();
}, true);

function openSongMenu(anchor, songId, user) {
    const wasOpen = songMenu && songMenu.anchor === anchor;
    closeSongMenu();
    if (wasOpen) return;

    songMenu = document.createElement('div');
    songMenu.anchor = anchor;
    songMenu.style.cssText = 'position:fixed;z-index:9998;padding:8px;border-radius:12px;color:#fff;font:22px sans-serif;background:rgba(40,30,60,0.96);box-shadow:0 8px 24px rgba(0,0,0,0.45);max-height:50vh;overflow:auto;';

    document.body.appendChild(songMenu);
    placeSongMenu(anchor);
    showSongMenu(anchor, songId, user);
}
