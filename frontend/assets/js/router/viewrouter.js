// frontend/assets/js/router/viewrouter.js

import { initEmployeeController } from "../controllers/employeecontroller.js";
import { initComplaintController } from "../controllers/complaintcontroller.js";

// Load a view into #app container
async function loadView(path) {
  const res = await fetch(path);
  if (!res.ok) {
    document.querySelector("#app").innerHTML = "<h2 class='text-red-500'>Failed to load page</h2>";
    return;
  }
  const html = await res.text();
  document.querySelector("#app").innerHTML = html;
}

// Decide which view to load based on URL
export async function router() {
  const path = window.location.pathname;

  if (path === "/" || path === "/home") {
    await loadView("/frontend/pages/home.html");
  } 
  else if (path === "/employee") {
    await loadView("/frontend/pages/students.html");
    initEmployeeController(); // Initialize controller after the view loads
  } 
  else if (path === "/complaints") {
    await loadView("/frontend/pages/complaints.html");
    initComplaintController(); // Initialize complaint controller
  } 
  else {
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
