import { $, createElement } from "../utils/dom.js";

// Resets the input form to its default state for creating a new employee
export function resetForm() {
  // Use the native .reset() method on the HTML form element
  $("employeeForm").reset();

  // Change the submit button text back to "Add employee"
  $("submitBtn").textContent = "Add employee";

  // Hide the "Cancel" button, as we are no longer in 'edit' mode
  $("cancelBtn").style.display = "none";
}

// Populates the input form fields with data from a selected employee object (for editing)
export function fillForm(employee) {
  // Fill each input field with the corresponding property from the employee data
  $("name").value = employee.name;
  $("email").value = employee.email;
  $("course").value = employee.course;
  $("year").value = employee.year;

  // Change the submit button text to "Update employee"
  $("submitBtn").textContent = "Update employee";

  // Show the "Cancel" button, allowing the user to exit 'edit' mode
  $("cancelBtn").style.display = "inline-block";
}