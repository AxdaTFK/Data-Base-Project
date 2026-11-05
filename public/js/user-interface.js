function goTo(page) {
    window.location.href = page;
}

function showMessage(text, isError) {
    const oldMessage = document.getElementById('status-message');
    if (oldMessage) oldMessage.remove();

    const message = document.createElement('div');
    message.id = 'status-message';
    message.textContent = text;
    message.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;padding:16px 24px;border-radius:12px;color:#fff;font:24px sans-serif;background:' + (isError ? '#c0392b' : '#27ae60');
    document.body.appendChild(message);
    setTimeout(function () { message.remove(); }, 4000);
}

function askText(title, placeholder, confirmText) {
    return new Promise(function (resolve) {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;display:flex;justify-content:center;align-items:center;background:rgba(0,0,0,0.55);backdrop-filter:blur(3px);';

        const dialog = document.createElement('div');
        dialog.style.cssText = 'width:560px;padding:40px;border-radius:27px;background:rgba(68,63,78,0.95);color:#fff;font:700 22px Iosevka,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,0.5);';

        const heading = document.createElement('div');
        heading.textContent = title;
        heading.style.cssText = 'margin-bottom:24px;font-size:36px;text-align:center;';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder;
        input.maxLength = 45;
        input.style.cssText = 'width:100%;height:50px;padding:0 24px;border:0;border-radius:29px;background:#fff;color:#000;font:inherit;outline:none;';

        const buttons = document.createElement('div');
        buttons.style.cssText = 'display:flex;justify-content:center;gap:20px;margin-top:28px;';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Cancelar';
        cancelButton.style.cssText = 'width:200px;height:50px;border-radius:29px;background:rgba(255,255,255,0.18);';

        const confirmButton = document.createElement('button');
        confirmButton.type = 'button';
        confirmButton.textContent = confirmText;
        confirmButton.style.cssText = 'width:200px;height:50px;border-radius:29px;background:#0002e0;';

        function close(value) {
            document.removeEventListener('keydown', onKey);
            overlay.remove();
            resolve(value);
        }

        function confirm() {
            const value = input.value.trim();
            if (!value) {
                input.focus();
                return;
            }
            close(value);
        }

        function onKey(event) {
            if (event.key === 'Escape') close(null);
            else if (event.key === 'Enter') confirm();
        }

        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) close(null);
        });
        cancelButton.addEventListener('click', function () {
            close(null);
        });
        confirmButton.addEventListener('click', confirm);
        document.addEventListener('keydown', onKey);

        buttons.appendChild(cancelButton);
        buttons.appendChild(confirmButton);
        dialog.appendChild(heading);
        dialog.appendChild(input);
        dialog.appendChild(buttons);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        input.focus();
    });
}

function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return minutes + ':' + seconds;
}

function getMonthlyExpiration(value) {
    if (!value) return null;

    const datePart = String(value).slice(0, 10).split('-');
    if (datePart.length !== 3) return null;

    const year = Number(datePart[0]);
    const month = Number(datePart[1]);
    const day = Number(datePart[2]);
    if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;

    const expirationMonth = month;
    const expirationYear = year + Math.floor(expirationMonth / 12);
    const nextMonth = expirationMonth % 12;
    const lastDay = new Date(expirationYear, nextMonth + 1, 0).getDate();
    return new Date(expirationYear, nextMonth, Math.min(day, lastDay));
}

function formatAdminDate(date) {
    if (!date) return 'Fecha no disponible';
    return new Intl.DateTimeFormat('es', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}
