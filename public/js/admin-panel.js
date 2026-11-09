const userList = document.getElementById("users-list");
const dashboardPanel = document.getElementById("user-history");
const contentForm = document.getElementById("content-form");
const subscriptionList = document.getElementById("subscriptions-list");
const adminSearchForm = document.getElementById("users-search-form");
const adminSearchInput = document.getElementById("users-search");
const uploadText = document.querySelector("#upload-area span");

function makeThumbnail(sourceImageFile) {
  return new Promise(function (resolveThumbnail, rejectThumbnail) {
    const image = new Image();
    image.onload = function () {
      const size = 200;
      const side = Math.min(image.width, image.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      canvas
        .getContext("2d")
        .drawImage(
          image,
          (image.width - side) / 2,
          (image.height - side) / 2,
          side,
          side,
          0,
          0,
          size,
          size,
        );
      resolveThumbnail(canvas.toDataURL("image/jpeg", 0.8));
    };
    image.onerror = function () {
      rejectThumbnail(new Error("Invalid image file"));
    };
    image.src = URL.createObjectURL(sourceImageFile);
  });
}

function getAudioDuration(sourceAudioFile) {
  return new Promise(function (resolveDuration, rejectDuration) {
    const audio = new Audio(URL.createObjectURL(sourceAudioFile));
    audio.addEventListener("loadedmetadata", function () {
      resolveDuration(Math.round(audio.duration));
    });
    audio.addEventListener("error", function () {
      rejectDuration(new Error("Invalid audio file"));
    });
  });
}

const adminUser = getStoredUser();
const isAdminPage = Boolean(userList || subscriptionList || contentForm);
const hasAdminAccess = Boolean(adminUser && adminUser.is_admin);

if (isAdminPage && !hasAdminAccess) {
  goTo("login.html");
}

let adminDirectory = [];
let adminSubscriptions = [];

function renderAdminDirectory(searchTermQuery) {
  if (!userList) return;

  const normalizedSearch = searchTermQuery.trim().toLocaleLowerCase();
  const matchingRecords = adminDirectory.filter(function (recordItem) {
    return recordItem.name.toLocaleLowerCase().includes(normalizedSearch);
  });
  const shownRecords =
    dashboardPanel && !normalizedSearch
      ? matchingRecords.slice(-6).reverse()
      : matchingRecords;

  userList.innerHTML = "";

  if (shownRecords.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-list-message";
    emptyMessage.textContent = normalizedSearch
      ? "No se encontraron coincidencias."
      : "No hay usuarios ni artistas para mostrar.";
    userList.appendChild(emptyMessage);
    return;
  }

  shownRecords.forEach(function (recordItem) {
    const card = document.createElement("div");
    card.className = "user-card";

    const photo = document.createElement("span");
    photo.className = "user-photo";

    const logo = document.createElement("img");
    logo.src =
      recordItem.type === "premium"
        ? "assets/LogoPremium.png"
        : recordItem.type === "artist"
          ? "assets/Dizzy Person.png"
          : "assets/logo-blanco.png";
    logo.alt =
      recordItem.type === "artist"
        ? "Artista"
        : recordItem.type === "premium"
          ? "Usuario premium"
          : "Usuario free";
    photo.appendChild(logo);

    card.append(photo, document.createTextNode(recordItem.name));
    userList.appendChild(card);
  });
}

async function loadUsers() {
  try {
    const response = await fetch(`${API_URL}/users`);
    const users = await response.json();

    if (!response.ok) throw new Error(users.error);

    const plansResponse = await fetch(`${API_URL}/suscriptions`);
    const plans = await plansResponse.json();
    const planTypes = {};

    plans.forEach(function (planItem) {
      planTypes[planItem.idsuscription] = String(planItem.type).toLowerCase();
    });

    const onlyPremium =
      new URLSearchParams(window.location.search).get("plan") === "premium";
    const userRecords = users
      .filter(function (userItem) {
        const type = planTypes[userItem.suscription_idsuscription];
        return !userItem.is_admin && (type === "premium" || type === "free");
      })
      .map(function (userItem) {
        return {
          name: userItem.name,
          type: planTypes[userItem.suscription_idsuscription],
        };
      });
    let artistRecords = [];

    if (!dashboardPanel) {
      const artistsResponse = await fetch(`${API_URL}/artists`);
      const artists = await artistsResponse.json();
      if (!artistsResponse.ok)
        throw new Error(artists.error || "No se pudieron cargar los artistas.");
      artistRecords = artists.map(function (artistItem) {
        return { name: artistItem.name, type: "artist" };
      });
    }

    adminDirectory = onlyPremium
      ? userRecords.filter(function (userItem) {
          return userItem.type === "premium";
        })
      : userRecords.concat(artistRecords);
    renderAdminDirectory(adminSearchInput ? adminSearchInput.value : "");
  } catch (error) {
    console.error("Error getting data:", error);
    userList.innerHTML =
      '<div class="empty-list-message">No se pudo cargar la información.</div>';
  }
}

if (userList && hasAdminAccess) {
  loadUsers();
}

function renderSubscriptions(searchTermQuery) {
  if (!subscriptionList) return;

  const normalizedSearch = searchTermQuery.trim().toLocaleLowerCase();
  const matchingSubscriptions = adminSubscriptions.filter(
    function (subscriptionItem) {
      return subscriptionItem.name
        .toLocaleLowerCase()
        .includes(normalizedSearch);
    },
  );

  subscriptionList.innerHTML = "";

  if (matchingSubscriptions.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-list-message";
    emptyMessage.textContent = normalizedSearch
      ? "No se encontraron suscripciones premium."
      : "No hay usuarios con un plan premium.";
    subscriptionList.appendChild(emptyMessage);
    return;
  }

  matchingSubscriptions.forEach(function (subscriptionItem) {
    const card = document.createElement("div");
    card.className = "user-card subscription-card";

    const photo = document.createElement("span");
    photo.className = "user-photo";
    const logo = document.createElement("img");
    logo.src = "assets/LogoPremium.png";
    logo.alt = "Usuario premium";
    photo.appendChild(logo);

    const details = document.createElement("span");
    details.className = "subscription-details";
    const name = document.createElement("span");
    name.className = "subscription-name";
    name.textContent = subscriptionItem.name;

    const expiration = document.createElement("span");
    expiration.className = "subscription-expiration";
    expiration.textContent =
      "Vence el: " + formatAdminDate(subscriptionItem.expiration);

    details.append(name, expiration);
    card.append(photo, details);
    subscriptionList.appendChild(card);
  });
}

async function loadSubscriptions() {
  try {
    const [usersResponse, plansResponse] = await Promise.all([
      fetch(`${API_URL}/users`),
      fetch(`${API_URL}/suscriptions`),
    ]);
    const users = await usersResponse.json();
    const plans = await plansResponse.json();
    if (!usersResponse.ok)
      throw new Error(users.error || "No se pudieron cargar los usuarios.");
    if (!plansResponse.ok)
      throw new Error(plans.error || "No se pudieron cargar los planes.");

    const planById = {};
    plans.forEach(function (planItem) {
      planById[planItem.idsuscription] = planItem;
    });

    adminSubscriptions = users
      .filter(function (userItem) {
        const plan = planById[userItem.suscription_idsuscription];
        return (
          !userItem.is_admin &&
          plan &&
          String(plan.type).toLowerCase() === "premium"
        );
      })
      .map(function (userItem) {
        const plan = planById[userItem.suscription_idsuscription];
        return {
          name: userItem.name,
          expiration: getMonthlyExpiration(plan.update_plan),
        };
      });
    renderSubscriptions(adminSearchInput ? adminSearchInput.value : "");
  } catch (error) {
    console.error("Error getting subscriptions:", error);
    subscriptionList.innerHTML =
      '<div class="empty-list-message">No se pudieron cargar las suscripciones.</div>';
  }
}

if (subscriptionList && hasAdminAccess) {
  loadSubscriptions();
}

if (adminSearchForm && adminSearchInput) {
  adminSearchForm.addEventListener("submit", function (submitEvent) {
    submitEvent.preventDefault();
    if (subscriptionList) {
      renderSubscriptions(adminSearchInput.value);
    } else {
      renderAdminDirectory(adminSearchInput.value);
    }
  });
  adminSearchInput.addEventListener("input", function () {
    if (subscriptionList) {
      renderSubscriptions(adminSearchInput.value);
    } else {
      renderAdminDirectory(adminSearchInput.value);
    }
  });
}

const addArtistButton = document.getElementById("add-artist-button");

if (addArtistButton && hasAdminAccess) {
  addArtistButton.addEventListener("click", async function (clickEvent) {
    clickEvent.preventDefault();

    const artistName = await askText(
      "Nuevo artista",
      "Nombre del artista",
      "Agregar",
    );
    if (!artistName) return;

    try {
      const artistsResponse = await fetch(`${API_URL}/artists`);
      const artists = await artistsResponse.json();

      if (!artistsResponse.ok) throw new Error(artists.error);

      const exists = artists.some(function (artistItem) {
        return artistItem.name.toLowerCase() === artistName.toLowerCase();
      });

      if (exists) {
        showMessage("Ese artista ya existe.", true);
        return;
      }

      const response = await sendJson(`/artists`, "POST", { name: artistName });

      const result = await response.json();

      if (!response.ok) {
        showMessage(result.error || "No se pudo crear el artista.", true);
        return;
      }

      showMessage("Artista agregado.", false);
    } catch (error) {
      console.error("Error:", error);
      showMessage("Error al crear el artista.", true);
    }
  });
}

async function findOrCreateArtist(artistText) {
  const artistsResponse = await fetch(`${API_URL}/artists`);
  if (!artistsResponse.ok) throw new Error("Could not get the artists");
  const artists = await artistsResponse.json();

  const existing = artists.find(function (artistItem) {
    return artistItem.name.toLowerCase() === artistText.toLowerCase();
  });

  if (existing) return existing;

  const newArtistResponse = await sendJson(`/artists`, "POST", {
    name: artistText,
  });
  const artist = await newArtistResponse.json();

  if (!newArtistResponse.ok) {
    showMessage(artist.error || "No se pudo crear el artista.", true);
    return null;
  }

  return artist;
}

async function saveCover(targetSongId, sourceCoverFile) {
  try {
    localStorage.setItem(
      "cover-" + targetSongId,
      await makeThumbnail(sourceCoverFile),
    );
  } catch (error) {
    console.error("Could not save the cover:", error);
  }
}

if (contentForm && hasAdminAccess) {
  contentForm.elements["archivo-audio"].addEventListener("change", function () {
    const chosenFile = contentForm.elements["archivo-audio"].files[0];
    if (chosenFile && uploadText) uploadText.textContent = chosenFile.name;
  });

  const coverInput = contentForm.elements["imagen-cancion"];
  const coverPreview = document.getElementById("cover-preview");

  if (coverInput && coverPreview) {
    coverInput.addEventListener("change", function () {
      const chosenImage = coverInput.files[0];

      if (!chosenImage) {
        coverPreview.style.backgroundImage = "";
        return;
      }

      coverPreview.style.backgroundImage =
        "url(" + URL.createObjectURL(chosenImage) + ")";
      coverPreview.style.backgroundSize = "cover";
      coverPreview.style.backgroundPosition = "center";
    });
  }

  contentForm.addEventListener("submit", async function (submitEvent) {
    submitEvent.preventDefault();

    const audioFile = contentForm.elements["archivo-audio"].files[0];

    if (!audioFile) {
      showMessage("Sube un archivo de audio.", true);
      return;
    }

    try {
      const duration = await getAudioDuration(audioFile);
      const artist = await findOrCreateArtist(
        contentForm.elements["artista"].value.trim(),
      );
      if (!artist) return;

      const data = {
        name: contentForm.elements["nombre-cancion"].value,
        duration: duration,
        album: contentForm.elements["album"].value || null,
        artist_idartist: artist.idartist,
      };

      const response = await sendJson(`/songs`, "POST", data);
      const result = await response.json();

      if (!response.ok) {
        showMessage(result.error || "No se pudo subir la canción.", true);
        return;
      }

      const audioData = new FormData();
      audioData.append("audio", audioFile);
      const audioResponse = await fetch(
        `${API_URL}/songs/${result.idsong}/audio`,
        {
          method: "POST",
          body: audioData,
        },
      );
      const audioResult = await audioResponse.json();

      if (!audioResponse.ok) {
        showMessage(audioResult.error || "No se pudo guardar el audio.", true);
        return;
      }

      const coverFile = coverInput && coverInput.files[0];
      if (coverFile) await saveCover(result.idsong, coverFile);

      goTo("admin-confirmation.html");
    } catch (error) {
      console.error("Error:", error);
      showMessage("Error al enviar el formulario.", true);
    }
  });
}
