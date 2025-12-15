import { initEmployeeController } from "../controllers/employeecontroller.js";

// Load a view into #app container
async function loadView(path) {
  const res = await fetch(path);
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
    await loadView("/frontend/pages/employee.html");
    initEmployeeController();
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

  // Back / forward buttons
  window.addEventListener("popstate", router);
}
