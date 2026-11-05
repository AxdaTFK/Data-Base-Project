const API_URL = '/main';

function sendJson(path, method, data) {
    return fetch(`${API_URL}${path}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

async function getHomePage(user) {
    if (user.is_admin) return 'admin-dashboard.html';

    const response = await fetch(`${API_URL}/suscriptions/${user.suscription_idsuscription}`);
    const subscription = await response.json();
    return String(subscription.type).toLowerCase() === 'premium' ? 'home-premium.html' : 'home-free.html';
}

async function getFreePlan() {
    const response = await fetch(`${API_URL}/suscriptions`);
    const plans = await response.json();

    return plans.find(function (plan) {
        return String(plan.type).toLowerCase() === 'free';
    });
}
