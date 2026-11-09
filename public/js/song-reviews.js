const reviewForm = document.getElementById('review-form');
const reviewTitle = document.getElementById('review-title');
const songDataBox = document.getElementById('song-details');
const artistLabel = document.getElementById('artist-name');
const ratingLabel = document.getElementById('rating');
const addToPlaylistButton = document.getElementById('add-to-playlist-button');
const reviewTagOption = document.getElementById('tags-option');
const reviewMetricsOption = document.getElementById('play-count-option');
const reviewTagsDialog = document.getElementById('review-tags-dialog');
const reviewTagInput = document.getElementById('review-tag-input');
const saveReviewTagButton = document.getElementById('save-review-tag');
const cancelReviewTagButton = document.getElementById('cancel-review-tag');
const removeReviewTagButton = document.getElementById('remove-review-tag');
let selectedRating = 0;

async function loadRating(songId) {
    const response = await fetch(`${API_URL}/songs/${songId}/reviews`);
    const reviews = await response.json();

    if (!response.ok || reviews.length === 0) {
        ratingLabel.textContent = '-';
        return;
    }

    const total = reviews.reduce(function (sum, review) {
        return sum + review.qualification;
    }, 0);
    ratingLabel.textContent = (total / reviews.length).toFixed(1);
}

async function loadSongData() {
    try {
        let songId = new URLSearchParams(window.location.search).get('song');

        if (!songId) {
            const listResponse = await fetch(`${API_URL}/songs`);
            const songs = await listResponse.json();

            if (!listResponse.ok || songs.length === 0) {
                showMessage('No hay canciones.', true);
                return;
            }
            songId = songs[0].idsong;
        }

        const songResponse = await fetch(`${API_URL}/songs/${songId}`);
        const song = await songResponse.json();

        if (!songResponse.ok) {
            showMessage(song.error || 'Canción no encontrada.', true);
            return;
        }

        const artistResponse = await fetch(`${API_URL}/artists/${song.artist_idartist}`);
        const artist = await artistResponse.json();
        const artistText = artistResponse.ok ? artist.name : 'Desconocido';
        const albumText = song.album || 'Sin álbum';

        currentSongId = song.idsong;
        audioPlayer.src = `${API_URL}/songs/${song.idsong}/audio`;
        audioPlayer.load();

        const paragraphs = songDataBox.querySelectorAll('p');
        paragraphs[0].textContent = song.name;
        paragraphs[1].textContent = albumText;
        artistLabel.textContent = artistText;

        const playerText = playerInfo.querySelector('div');
        playerText.textContent = '';
        playerText.append(song.name, document.createElement('br'), artistText + ' - ' + albumText);

        await loadRating(currentSongId);

    } catch (error) {
        console.error('Error getting data:', error);
        showMessage('Error al obtener la información.', true);
    }
}

if (reviewForm) {
    const reviewUser = getStoredUser();
    let reviewTag = '';

    if (!reviewUser) {
        goTo('login.html');
    } else {
        const starBox = document.createElement('span');
        starBox.id = 'rating-stars';
        starBox.style.cssText = 'margin-left:16px;cursor:pointer;font-size:40px;';

        for (let value = 1; value <= 5; value++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.setAttribute('data-value', value);
            star.style.color = '#888';
            starBox.appendChild(star);
        }
        reviewTitle.appendChild(starBox);

        reviewTagOption.addEventListener('click', function () {
            reviewTagInput.value = reviewTag;
            removeReviewTagButton.hidden = !reviewTag;
            reviewTagsDialog.showModal();
            reviewTagInput.focus();
        });

        saveReviewTagButton.addEventListener('click', function () {
            const value = reviewTagInput.value.trim();
            if (!value) {
                reviewTagInput.setCustomValidity('Escribe una etiqueta antes de guardar.');
                reviewTagInput.reportValidity();
                return;
            }

            reviewTagInput.setCustomValidity('');
            reviewTag = value.slice(0, 45);
            reviewTagOption.classList.remove('disabled-option');
            reviewTagsDialog.close();
        });

        reviewTagInput.addEventListener('input', function () {
            reviewTagInput.setCustomValidity('');
        });

        cancelReviewTagButton.addEventListener('click', function () {
            reviewTagsDialog.close();
        });

        removeReviewTagButton.addEventListener('click', function () {
            reviewTag = '';
            reviewTagOption.classList.add('disabled-option');
            reviewTagsDialog.close();
        });

        reviewMetricsOption.addEventListener('click', function () {
            reviewMetricsOption.classList.toggle('disabled-option');
        });

        if (addToPlaylistButton) {
            addToPlaylistButton.addEventListener('click', function (event) {
                event.preventDefault();

                if (!currentSongId) {
                    showMessage('La canción aún no ha cargado.', true);
                    return;
                }

                openSongMenu(addToPlaylistButton, currentSongId, reviewUser);
            });
        }

        function paintStars(rating) {
            Array.from(starBox.children).forEach(function (star) {
                const isSelected = Number(star.getAttribute('data-value')) <= rating;
                star.style.color = isSelected ? '#f1c40f' : '#888';
            });
        }

        starBox.addEventListener('click', function (event) {
            const value = event.target.getAttribute('data-value');
            if (!value) return;
            selectedRating = Number(value);
            paintStars(selectedRating);
        });

        loadSongData();

        reviewForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            if (!currentSongId) {
                showMessage('La canción aún no ha cargado.', true);
                return;
            }

            if (selectedRating === 0) {
                showMessage('Elige una calificación de 1 a 5 estrellas.', true);
                return;
            }

            const tag = reviewTagOption.classList.contains('disabled-option') ? null : reviewTag;

            let metrics = null;

            if (!reviewMetricsOption.classList.contains('disabled-option')) {
                metrics = getPlays(currentSongId) + ' plays';
            }

            const data = {
                tag: tag,
                comment: reviewForm.elements['resena'].value,
                qualification: selectedRating,
                metrics: metrics,
                song_idsong: currentSongId,
                user_iduser: reviewUser.iduser
            };

            try {
                const response = await sendJson(`/reviews`, 'POST', data);

                const result = await response.json();

                if (!response.ok) {
                    showMessage(result.error || 'No se pudo publicar la reseña.', true);
                    return;
                }

                showMessage('Reseña publicada.', false);
                reviewForm.elements['resena'].value = '';
                selectedRating = 0;
                reviewTag = '';
                reviewTagOption.classList.add('disabled-option');
                paintStars(0);
                await loadRating(currentSongId);

            } catch (error) {
                console.error('Error:', error);
                showMessage('Error al enviar la reseña.', true);
            }
        });
    }
}
