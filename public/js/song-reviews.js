const reviewForm = document.getElementById("review-form");
const reviewTitle = document.getElementById("review-title");
const songDataBox = document.getElementById("song-details");
const artistLabel = document.getElementById("artist-name");
const ratingLabel = document.getElementById("rating");
const addToPlaylistButton = document.getElementById("add-to-playlist-button");
const reviewTagOption = document.getElementById("tags-option");
const reviewMetricsOption = document.getElementById("play-count-option");
const reviewTagsDialog = document.getElementById("review-tags-dialog");
const reviewTagInput = document.getElementById("review-tag-input");
const saveReviewTagButton = document.getElementById("save-review-tag");
const cancelReviewTagButton = document.getElementById("cancel-review-tag");
const removeReviewTagButton = document.getElementById("remove-review-tag");
let selectedRating = 0;

async function loadRating(targetSongId) {
  const reviewResponse = await fetch(
    `${API_URL}/songs/${targetSongId}/reviews`,
  );
  const songReviews = await reviewResponse.json();

  if (!reviewResponse.ok || songReviews.length === 0) {
    ratingLabel.textContent = "-";
    return;
  }

  const totalScore = songReviews.reduce(function (accumulator, currentReview) {
    return accumulator + currentReview.qualification;
  }, 0);
  ratingLabel.textContent = (totalScore / songReviews.length).toFixed(1);
}

async function loadSongData() {
  try {
    let activeSongId = new URLSearchParams(window.location.search).get("song");

    if (!activeSongId) {
      const listResponse = await fetch(`${API_URL}/songs`);
      const songListResult = await listResponse.json();

      if (!listResponse.ok || songListResult.length === 0) {
        showMessage("No hay canciones.", true);
        return;
      }
      activeSongId = songListResult[0].idsong;
    }

    const songResponse = await fetch(`${API_URL}/songs/${activeSongId}`);
    const songDetails = await songResponse.json();

    if (!songResponse.ok) {
      showMessage(songDetails.error || "Canción no encontrada.", true);
      return;
    }

    const artistResponse = await fetch(
      `${API_URL}/artists/${songDetails.artist_idartist}`,
    );
    const artistDetails = await artistResponse.json();
    const resolvedArtistName = artistResponse.ok
      ? artistDetails.name
      : "Desconocido";
    const resolvedAlbumName = songDetails.album || "Sin álbum";

    currentSongId = songDetails.idsong;
    audioPlayer.src = `${API_URL}/songs/${songDetails.idsong}/audio`;
    audioPlayer.load();

    const descriptionParagraphs = songDataBox.querySelectorAll("p");
    descriptionParagraphs[0].textContent = songDetails.name;
    descriptionParagraphs[1].textContent = resolvedAlbumName;
    artistLabel.textContent = resolvedArtistName;

    const playerTextContainer = playerInfo.querySelector("div");
    playerTextContainer.textContent = "";
    playerTextContainer.append(
      songDetails.name,
      document.createElement("br"),
      resolvedArtistName + " - " + resolvedAlbumName,
    );

    await loadRating(currentSongId);
  } catch (error) {
    console.error("Error getting data:", error);
    showMessage("Error al obtener la información.", true);
  }
}

if (reviewForm) {
  const activeReviewUser = getStoredUser();
  let userReviewTag = "";

  if (!activeReviewUser) {
    goTo("login.html");
  } else {
    const starBox = document.createElement("span");
    starBox.id = "rating-stars";
    starBox.style.cssText =
      "margin-left:16px;cursor:pointer;font-size:40px;display:inline-flex;gap:4px;align-items:center;";

    for (let starIndex = 1; starIndex <= 5; starIndex++) {
      const starElement = document.createElement("span");
      starElement.setAttribute("data-value", starIndex);
      starElement.style.cssText =
        "width:32px;height:32px;display:inline-block;cursor:pointer;color:#888;";
      starElement.innerHTML =
        '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
      starBox.appendChild(starElement);
    }
    reviewTitle.appendChild(starBox);

    reviewTagOption.addEventListener("click", function () {
      reviewTagInput.value = userReviewTag;
      removeReviewTagButton.hidden = !userReviewTag;
      reviewTagsDialog.showModal();
      reviewTagInput.focus();
    });

    saveReviewTagButton.addEventListener("click", function () {
      const inputTagValue = reviewTagInput.value.trim();
      if (!inputTagValue) {
        reviewTagInput.setCustomValidity(
          "Escribe una etiqueta antes de guardar.",
        );
        reviewTagInput.reportValidity();
        return;
      }

      reviewTagInput.setCustomValidity("");
      userReviewTag = inputTagValue.slice(0, 45);
      reviewTagOption.classList.remove("disabled-option");
      reviewTagsDialog.close();
    });

    reviewTagInput.addEventListener("input", function () {
      reviewTagInput.setCustomValidity("");
    });

    cancelReviewTagButton.addEventListener("click", function () {
      reviewTagsDialog.close();
    });

    removeReviewTagButton.addEventListener("click", function () {
      userReviewTag = "";
      reviewTagOption.classList.add("disabled-option");
      reviewTagsDialog.close();
    });

    reviewMetricsOption.addEventListener("click", function () {
      reviewMetricsOption.classList.toggle("disabled-option");
    });

    if (addToPlaylistButton) {
      addToPlaylistButton.addEventListener("click", function (event) {
        event.preventDefault();

        if (!currentSongId) {
          showMessage("La canción aún no ha cargado.", true);
          return;
        }

        openSongMenu(addToPlaylistButton, currentSongId, activeReviewUser);
      });
    }

    function paintStars(ratingScore) {
      Array.from(starBox.children).forEach(function (starContainer) {
        const isSelected =
          Number(starContainer.getAttribute("data-value")) <= ratingScore;
        starContainer.style.color = isSelected ? "#f1c40f" : "#888";
      });
    }

    starBox.addEventListener("click", function (event) {
      const clickedStar = event.target.closest("[data-value]");
      if (!clickedStar) return;
      const starValue = clickedStar.getAttribute("data-value");
      selectedRating = Number(starValue);
      paintStars(selectedRating);
    });

    loadSongData();

    reviewForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!currentSongId) {
        showMessage("La canción aún no ha cargado.", true);
        return;
      }

      if (selectedRating === 0) {
        showMessage("Elige una calificación de 1 a 5 estrellas.", true);
        return;
      }

      const assignedTag = reviewTagOption.classList.contains("disabled-option")
        ? null
        : userReviewTag;

      let computedMetrics = null;

      if (!reviewMetricsOption.classList.contains("disabled-option")) {
        computedMetrics = getPlays(currentSongId) + " plays";
      }

      const reviewPayload = {
        tag: assignedTag,
        comment: reviewForm.elements["resena"].value,
        qualification: selectedRating,
        metrics: computedMetrics,
        song_idsong: currentSongId,
        user_iduser: activeReviewUser.iduser,
      };

      try {
        const response = await sendJson(`/reviews`, "POST", reviewPayload);

        const responseResult = await response.json();

        if (!response.ok) {
          showMessage(
            responseResult.error || "No se pudo publicar la reseña.",
            true,
          );
          return;
        }

        showMessage("Reseña publicada.", false);
        reviewForm.elements["resena"].value = "";
        selectedRating = 0;
        userReviewTag = "";
        reviewTagOption.classList.add("disabled-option");
        paintStars(0);
        await loadRating(currentSongId);
      } catch (error) {
        console.error("Error:", error);
        showMessage("Error al enviar la reseña.", true);
      }
    });
  }
}
