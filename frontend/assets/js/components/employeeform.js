import { $ } from "../utils/dom.js";

// Resets the input form to default state
export function resetForm() {
  $("employeeForm").reset();
  $("submitBtn").textContent = "Add employee";
  $("cancelBtn").style.display = "none";
}

// Fills the form for editing
export function fillForm(employee) {
  $("name").value = employee.name || "";
  $("email").value = employee.email || "";
  $("course").value = employee.course || "";
  $("year").value = employee.year || "";

  $("submitBtn").textContent = "Update employee";
  $("cancelBtn").style.display = "inline-block";
}
