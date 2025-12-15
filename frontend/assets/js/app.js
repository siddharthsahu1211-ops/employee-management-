// Main entrypoint for frontend
// import { initemployeeController } from "./controllers/employeecontroller.js";
import { router } from "./router/viewrouter.js";

// Initialize app on page load
window.addEventListener("DOMContentLoaded", () => {
  router();
  // initemployeeController();
});