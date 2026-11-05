const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('signup-form');

const loadingIndicator = document.getElementById('loading-indicator');

if (loadingIndicator) {
    const target = new URLSearchParams(window.location.search).get('destino');
    const destination = /^[a-z-]+\.html$/.test(target || '') ? target : 'login.html';
    setTimeout(function () {
        goTo(destination);
    }, 1500);
}

if (loginForm) {
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const data = {
            email: loginForm.elements['correo'].value,
            password: loginForm.elements['contrasena'].value
        };

        try {
            const response = await sendJson(`/users/login`, 'POST', data);

            const result = await response.json();

            if (!response.ok) {
                showMessage(result.error || 'No se pudo iniciar sesión.', true);
                return;
            }

            localStorage.setItem('user', JSON.stringify(result.user));
            goTo('loading.html?destino=' + await getHomePage(result.user));

        } catch (error) {
            console.error('Error:', error);
            showMessage('Error al enviar el formulario.', true);
        }
    });
}

function isStrongPassword(password) {
    return /[A-Z]/.test(password) && /[\d\W_]/.test(password) && password.length >= 10;
}

if (registerForm) {
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = registerForm.elements['usuario'].value;
        const email = registerForm.elements['correo'].value;
        const password = registerForm.elements['contrasena'].value;

        if (!isStrongPassword(password)) {
            showMessage('La contraseña no cumple los requisitos.', true);
            return;
        }

        try {
            const freePlan = await getFreePlan();

            if (!freePlan) {
                showMessage('El plan Free no existe.', true);
                return;
            }

            const data = {
                name: name,
                email: email,
                password: password,
                is_admin: 0,
                suscription_idsuscription: freePlan.idsuscription
            };

            const response = await sendJson(`/users`, 'POST', data);

            const result = await response.json();

            if (!response.ok) {
                showMessage(result.error || 'No se pudo crear la cuenta.', true);
                return;
            }

            const loginResponse = await sendJson(`/users/login`, 'POST', { email: email, password: password });

            const loginResult = await loginResponse.json();

            if (!loginResponse.ok) {
                showMessage(loginResult.error || 'Cuenta creada, inicia sesión.', true);
                goTo('login.html');
                return;
            }

            localStorage.setItem('user', JSON.stringify(loginResult.user));
            goTo('loading.html?destino=' + await getHomePage(loginResult.user));

        } catch (error) {
            console.error('Error:', error);
            showMessage('Error al enviar el formulario.', true);
        }
    });
}
