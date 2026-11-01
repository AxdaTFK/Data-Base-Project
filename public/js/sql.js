// Post Elements
const postBtn = document.getElementById("postBtn");
const name = document.getElementById("name");
const birthdate = document.getElementById("birthdate");

// Get Elements
const getAllBtn = document.getElementById("getAllBtn");
const id = document.getElementById("id");
const getOneBtn = document.getElementById("getOneBtn");

if (postBtn) {
  postBtn.addEventListener("click", async function () {
    const data = {
      name: name.value,
      birthdate: birthdate.value,
    };

    try {
      const response = await fetch("/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const message = await response.text();
      document.getElementById("postSqlResult").innerText = message;
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("postSqlResult").innerText =
        "Error sending the form.";
    }
  });
}

if (getAllBtn) {
  getAllBtn.addEventListener("click", async function () {
    try {
      const response = await fetch("/test");
      const data = await response.json();

      const list = document.getElementById("getAllResult");
      list.innerHTML = "";

      if (data.length === 0) {
        list.innerHTML = "<li>There is no info</li>";
      } else {
        data.forEach((entry) => {
          const li = document.createElement("li");
          li.textContent = JSON.stringify(entry);
          list.appendChild(li);
        });
      }
    } catch (error) {
      console.error("Error getting data:", error);
      document.getElementById("getAllResult").innerHTML =
        "<li>Error obtaining info.</li>";
    }
  });
}

if (getOneBtn) {
  getOneBtn.addEventListener("click", async function () {
    const userId = id.value;

    try {
      const response = await fetch(`/test/${userId}`);
      const data = await response.json();

      const resultContainer = document.getElementById("getOneResult");
      resultContainer.innerHTML = "";

      if (!data || Object.keys(data).length === 0) {
        resultContainer.innerHTML = "<li>There is no info</li>";
      } else {
        Object.entries(data).forEach(([key, value]) => {
          const li = document.createElement("li");
          li.textContent = `${key}: ${value}`;
          resultContainer.appendChild(li);
        });
      }
    } catch (error) {
      console.error("Error getting data:", error);
      document.getElementById("getOneResult").innerHTML = "<li>Error</li>";
    }
  });
}

const formularioRegistro = document.getElementById("formulario-registro");

if (formularioRegistro) {
  formularioRegistro.addEventListener("submit", function (event) {
    const contrasena = formularioRegistro.querySelector(
      'input[name="contrasena"]',
    );

    if (contrasena) {
      const password = contrasena.value;

      const tieneMayuscula = /[A-Z]/.test(password);
      const tieneNumeroOEspecial = /[0-9]|[^A-Za-z0-9]/.test(password);
      const tieneLongitud = password.length >= 10;

      if (!tieneMayuscula || !tieneNumeroOEspecial || !tieneLongitud) {
        event.preventDefault();

        alert(
          "La contraseña debe tener una letra mayúscula, " +
            "un número o carácter especial y mínimo 10 caracteres.",
        );

        contrasena.focus();
      }
    }
  });
}

const listaCanciones = document.getElementById("lista-canciones");

if (listaCanciones) {
  // Elementos del reproductor
  const buscador = document.getElementById("buscador");
  const botonReproducir = document.getElementById("boton-reproducir");
  const botonAnterior = document.getElementById("boton-anterior");
  const botonSiguiente = document.getElementById("boton-siguiente");
  const controlProgreso = document.getElementById("control-progreso");
  const controlVolumen = document.getElementById("control-volumen");
  const informacionCancion = document.getElementById("informacion-cancion");

  const canciones = listaCanciones.querySelectorAll(".cancion");

  let cancionActual = 0;
  let reproduciendo = false;

  if (buscador) {
    buscador.addEventListener("input", function () {
      const busqueda = buscador.value.toLowerCase();

      canciones.forEach(function (cancion) {
        const titulo = cancion
          .querySelector(".titulo-cancion")
          .textContent.toLowerCase();

        const artista = cancion
          .querySelector(".artista-cancion")
          .textContent.toLowerCase();

        if (titulo.includes(busqueda) || artista.includes(busqueda)) {
          cancion.style.display = "";
        } else {
          cancion.style.display = "none";
        }
      });
    });
  }

  function seleccionarCancion(numero) {
    if (canciones.length === 0) {
      return;
    }

    cancionActual = (numero + canciones.length) % canciones.length;

    const cancion = canciones[cancionActual];

    const titulo = cancion.querySelector(".titulo-cancion").textContent;

    const artista = cancion.querySelector(".artista-cancion").textContent;

    if (informacionCancion) {
      const texto = informacionCancion.querySelector("div");

      if (texto) {
        texto.innerHTML = `${titulo}<br>${artista}`;
      }
    }

    canciones.forEach(function (elemento) {
      elemento.classList.remove("cancion-seleccionada");
    });

    cancion.classList.add("cancion-seleccionada");
  }

  canciones.forEach(function (cancion, index) {
    cancion.addEventListener("click", function (event) {
      if (event.target.closest(".acciones-cancion")) {
        return;
      }

      seleccionarCancion(index);
    });
  });

  if (botonReproducir) {
    botonReproducir.addEventListener("click", function () {
      reproduciendo = !reproduciendo;

      if (reproduciendo) {
        botonReproducir.src = "assets/pause-button.png";
        botonReproducir.alt = "Pausar";
      } else {
        botonReproducir.src = "assets/play-button.png";
        botonReproducir.alt = "Reproducir";
      }
    });
  }

  if (botonAnterior) {
    botonAnterior.addEventListener("click", function () {
      seleccionarCancion(cancionActual - 1);
    });
  }

  if (botonSiguiente) {
    botonSiguiente.addEventListener("click", function () {
      seleccionarCancion(cancionActual + 1);
    });
  }

  canciones.forEach(function (cancion) {
    const favorito = cancion.querySelector(".accion-favorito");

    if (favorito) {
      favorito.addEventListener("click", function () {
        favorito.classList.toggle("favorito-activo");
      });
    }
  });

  if (controlProgreso) {
    controlProgreso.addEventListener("input", function () {
      const porcentaje = (controlProgreso.value / controlProgreso.max) * 100;

      controlProgreso.style.setProperty(
        "--porcentaje-relleno",
        porcentaje + "%",
      );
    });
  }

  if (controlVolumen) {
    controlVolumen.addEventListener("input", function () {
      const porcentaje = (controlVolumen.value / controlVolumen.max) * 100;

      controlVolumen.style.setProperty(
        "--porcentaje-relleno",
        porcentaje + "%",
      );
    });
  }
  if (canciones.length > 0) {
    seleccionarCancion(0);
  }
}
