const planDate = document.getElementById("plan-expiration-value");
const planDateLabel = document.getElementById("plan-expiration");
const planBannerDate = document.getElementById("banner-expiration-date");
const planButtons = document.querySelectorAll(".plan-button");

function getToday() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return today.getFullYear() + "-" + month + "-" + day;
}

async function loadPlanDate(user) {
  try {
    const response = await fetch(
      `${API_URL}/suscriptions/${user.suscription_idsuscription}`,
    );
    const subscription = await response.json();

    if (!response.ok || !subscription.update_plan) return;

    const expiration = getMonthlyExpiration(subscription.update_plan);
    planDate.textContent = formatAdminDate(expiration);
    if (planBannerDate)
      planBannerDate.textContent = formatAdminDate(expiration);

    if (expiration && planDateLabel) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      planDateLabel.firstChild.textContent =
        expiration < today ? "Venció el " : "Vence el ";
    }
  } catch (error) {
    console.error("Error getting the plan date:", error);
  }
}

if (planDate) {
  const planUser = getStoredUser();
  if (planUser) loadPlanDate(planUser);
}

async function getTargetPlan(index) {
  if (index === 1) {
    const response = await sendJson(`/suscriptions`, "POST", {
      type: "premium",
      update_plan: getToday(),
    });
    const plan = await response.json();

    if (!response.ok) {
      showMessage(plan.error || "No se pudo cambiar el plan.", true);
      return null;
    }

    return plan;
  }

  const freePlan = await getFreePlan();

  if (!freePlan) showMessage("El plan Free no existe.", true);
  return freePlan || null;
}

async function saveUserPlan(user, plan) {
  const data = {
    name: user.name,
    email: user.email,
    is_admin: user.is_admin,
    suscription_idsuscription: plan.idsuscription,
  };

  const response = await sendJson(`/users/${user.iduser}`, "PUT", data);
  const result = await response.json();

  if (!response.ok) {
    showMessage(result.error || "No se pudo cambiar el plan.", true);
    return false;
  }

  user.suscription_idsuscription = plan.idsuscription;
  localStorage.setItem("user", JSON.stringify(user));
  return true;
}

planButtons.forEach(function (button, index) {
  button.addEventListener("click", async function () {
    const user = getStoredUser();

    if (!user) {
      goTo("login.html");
      return;
    }

    try {
      const currentPage = await getHomePage(user);

      if (
        (index === 1 && currentPage === "home-premium.html") ||
        (index === 0 && currentPage === "home-free.html")
      ) {
        showMessage("Ya tienes este plan.", true);
        return;
      }

      const plan = await getTargetPlan(index);
      if (!plan || !(await saveUserPlan(user, plan))) return;

      goTo("loading.html?destino=" + (await getHomePage(user)));
    } catch (error) {
      console.error("Error:", error);
      showMessage("Error al cambiar el plan.", true);
    }
  });
});
