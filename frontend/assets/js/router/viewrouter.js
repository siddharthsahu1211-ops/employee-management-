// frontend/assets/js/router/viewrouter.js
import { initEmployeeController } from "../controllers/employeecontroller.js";
import { initComplaintController } from "../controllers/complaintcontroller.js";
import { initPayrollController } from "../controllers/payrollcontroller.js";
import { initReportsController } from "../controllers/reportscontroller.js";
import { initDepartmentsController } from "../controllers/departmentscontroller.js";
import { initHomeController } from "../controllers/homecontroller.js";

// Load a view into #app container
async function loadView(path) {
  const appContainer = document.querySelector("#app");
  if (!appContainer) {
    console.error("No #app container found in DOM");
    return;
  }

  // Show loading
  appContainer.innerHTML = `<div class="flex justify-center items-center py-20"><i class="fas fa-spinner fa-spin text-orange-500 text-3xl"></i></div>`;
  
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Failed to fetch page");

    const html = await res.text();
    appContainer.innerHTML = html;
  } catch (err) {
    console.error(err);
    appContainer.innerHTML = `<h2 class='text-red-500'>Failed to load page</h2>`;
  }
}

// Decide which view to load based on URL
export async function router() {
  const path = window.location.pathname;

  switch (path) {
    case "/":
    case "/home":
      console.log("Loading home view");
      await loadView("/frontend/pages/home.html");
      initHomeController(); // Initialize home controller
      break;

    case "/employee":
      console.log("Loading employee view");
      await loadView("/frontend/pages/students.html");
      initEmployeeController(); // Initialize controller after view is loaded
      break;

    case "/complaints":
      console.log("Loading complaints view");
      await loadView("/frontend/pages/complaints.html");
      initComplaintController(); // Initialize complaints controller
      break;
    case "/payroll":
      console.log("Loading payroll view");
      await loadView("/frontend/pages/payroll.html");
      initPayrollController(); // Initialize payroll controller
      break;

    case "/departments":
      console.log("Loading departments view");
      await loadView("/frontend/pages/departments.html");
      initDepartmentsController(); // Initialize departments controller
      break;

    case "/reports":
      console.log("Loading reports view");
      await loadView("/frontend/pages/reports.html");
      initReportsController(); // Initialize reports controller
      break;

    case "/profile":
      console.log("Loading profile view");
      await loadView("/frontend/pages/profile.html");
      // No controller needed - profile page handles its own logic
      break;

    default:
      console.log("Loading 404 view for path:", path);
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
