// frontend/assets/js/router/viewrouter.js
import { initEmployeeController } from "../controllers/employeecontroller.js";
import { initComplaintController } from "../controllers/complaintcontroller.js";
import { initPayrollController } from "../controllers/payrollcontroller.js";

// Load a view into #app container
async function loadView(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Failed to fetch page");

    const html = await res.text();
    const appContainer = document.querySelector("#app");
    if (!appContainer) {
      console.error("No #app container found in DOM");
      return;
    }

    appContainer.innerHTML = html;
  } catch (err) {
    console.error(err);
    document.querySelector("#app").innerHTML = `<h2 class='text-red-500'>Failed to load page</h2>`;
  }
}

// Decide which view to load based on URL
export async function router() {
  const path = window.location.pathname;

  switch (path) {
    case "/":
    case "/home":
      await loadView("/frontend/pages/home.html");
      break;

    case "/employee":
      await loadView("/frontend/pages/students.html");
      initEmployeeController(); // Initialize controller after view is loaded
      break;

    case "/complaints":
      await loadView("/frontend/pages/complaints.html");
      initComplaintController(); // Initialize complaints controller
      break;
    case "/payroll":
      await loadView("/frontend/pages/payroll.html");
      initPayrollController(); // Initialize payroll controller
      break;

    default:
      await loadView("/frontend/pages/404.html");
  }
}

// Make links work without page reload
export function initRouterEvents() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-link]");
    if (!link) return;

    e.preventDefault();
    history.pushState(null, "", link.href);
    router();
  });

  // Handle back/forward buttons
  window.addEventListener("popstate", router);
}

// Initialize router when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  router();
  initRouterEvents();
});
