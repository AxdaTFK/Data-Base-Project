function goTo(page) {
  window.location.href = page;
}

function showMessage(text, isError) {
  const existingMessage = document.getElementById("status-message");
  if (existingMessage) existingMessage.remove();

  const toastElement = document.createElement("div");
  toastElement.id = "status-message";
  toastElement.textContent = text;
  toastElement.style.cssText =
    "position:fixed;top:20px;right:20px;z-index:9999;padding:16px 24px;border-radius:12px;color:#fff;font:24px sans-serif;background:" +
    (isError ? "#c0392b" : "#27ae60");
  document.body.appendChild(toastElement);
  setTimeout(function () {
    toastElement.remove();
  }, 4000);
}

function askText(title, placeholder, confirmText) {
  return new Promise(function (resolvePromise) {
    const modalOverlay = document.createElement("div");
    modalOverlay.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;display:flex;justify-content:center;align-items:center;background:rgba(0,0,0,0.55);backdrop-filter:blur(3px);";

    const dialogBox = document.createElement("div");
    dialogBox.style.cssText =
      "width:560px;padding:40px;border-radius:27px;background:rgba(68,63,78,0.95);color:#fff;font:700 22px Iosevka,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,0.5);";

    const headingElement = document.createElement("div");
    headingElement.textContent = title;
    headingElement.style.cssText =
      "margin-bottom:24px;font-size:36px;text-align:center;";

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.placeholder = placeholder;
    textInput.maxLength = 45;
    textInput.style.cssText =
      "width:100%;height:50px;padding:0 24px;border:0;border-radius:29px;background:#fff;color:#000;font:inherit;outline:none;";

    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText =
      "display:flex;justify-content:center;gap:20px;margin-top:28px;";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Cancelar";
    cancelButton.style.cssText =
      "width:200px;height:50px;border-radius:29px;background:rgba(255,255,255,0.18);";

    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.textContent = confirmText;
    confirmButton.style.cssText =
      "width:200px;height:50px;border-radius:29px;background:#0002e0;";

    function closeDialog(resolvedInputText) {
      document.removeEventListener("keydown", handleKeydownEvent);
      modalOverlay.remove();
      resolvePromise(resolvedInputText);
    }

    function confirmInput() {
      const trimmedInputText = textInput.value.trim();
      if (!trimmedInputText) {
        textInput.focus();
        return;
      }
      closeDialog(trimmedInputText);
    }

    function handleKeydownEvent(keyboardEvent) {
      if (keyboardEvent.key === "Escape") closeDialog(null);
      else if (keyboardEvent.key === "Enter") confirmInput();
    }

    modalOverlay.addEventListener("click", function (clickEvent) {
      if (clickEvent.target === modalOverlay) closeDialog(null);
    });
    cancelButton.addEventListener("click", function () {
      closeDialog(null);
    });
    confirmButton.addEventListener("click", confirmInput);
    document.addEventListener("keydown", handleKeydownEvent);

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);
    dialogBox.appendChild(headingElement);
    dialogBox.appendChild(textInput);
    dialogBox.appendChild(buttonContainer);
    modalOverlay.appendChild(dialogBox);
    document.body.appendChild(modalOverlay);
    textInput.focus();
  });
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return minutes + ":" + seconds;
}

function getMonthlyExpiration(rawDateString) {
  if (!rawDateString) return null;

  const dateSegments = String(rawDateString).slice(0, 10).split("-");
  if (dateSegments.length !== 3) return null;

  const parsedYear = Number(dateSegments[0]);
  const parsedMonth = Number(dateSegments[1]);
  const parsedDay = Number(dateSegments[2]);
  if (
    !parsedYear ||
    parsedMonth < 1 ||
    parsedMonth > 12 ||
    parsedDay < 1 ||
    parsedDay > 31
  )
    return null;

  const targetMonth = parsedMonth;
  const targetYear = parsedYear + Math.floor(targetMonth / 12);
  const subsequentMonth = targetMonth % 12;
  const computedLastDay = new Date(
    targetYear,
    subsequentMonth + 1,
    0,
  ).getDate();
  return new Date(
    targetYear,
    subsequentMonth,
    Math.min(parsedDay, computedLastDay),
  );
}

function formatAdminDate(targetDateObject) {
  if (!targetDateObject) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(targetDateObject);
}
