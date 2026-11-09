const API_URL = "/main";

function sendJson(targetEndpointPath, httpMethod, payloadData) {
  return fetch(`${API_URL}${targetEndpointPath}`, {
    method: httpMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payloadData),
  });
}

async function getHomePage(currentUserObject) {
  if (currentUserObject.is_admin) return "admin-dashboard.html";

  const subscriptionResponse = await fetch(
    `${API_URL}/suscriptions/${currentUserObject.suscription_idsuscription}`,
  );
  const subscriptionDetails = await subscriptionResponse.json();
  return String(subscriptionDetails.type).toLowerCase() === "premium"
    ? "home-premium.html"
    : "home-free.html";
}

async function getFreePlan() {
  const plansResponse = await fetch(`${API_URL}/suscriptions`);
  const availablePlans = await plansResponse.json();

  return availablePlans.find(function (targetPlan) {
    return String(targetPlan.type).toLowerCase() === "free";
  });
}
