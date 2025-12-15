import { $ } from "../utils/dom.js";
// import { editemployee, deleteemployeeAction } from "../controllers/employeeController.js";

// Renders the list of employee into an HTML table
export function renderemployeeTable(employee) {
  // Get references to the table body where rows will be inserted and the 'no employee' message
  const body = $("employeeTableBody");
  const noemployee = $("noemployee");

  // Clear any existing rows from the table body before rendering new data
  body.innerHTML = "";

  // Check if the employee array is empty
  if (employee.length === 0) {
    // If no employee are found, display the 'no employee' message and stop execution
    noemployee.style.display = "block";
    return;
  }

  // If employee exist, hide the 'no employee' message
  noemployee.style.display = "none";

  // Iterate over each employee object in the provided array
  employee.forEach(employee => {
    // Create a new table row element for the current employee
    const row = document.createElement("tr");
    row.className = "border-b"; // Add styling class (likely Tailwind CSS)

    // Populate the row with dynamic HTML content using a template literal
    row.innerHTML = `
      <td class="px-3 py-2">${employee.id}</td>
      <td class="px-3 py-2">${employee.name}</td>
      <td class="px-3 py-2">${employee.email}</td>
      <td class="px-3 py-2">${employee.course}</td>
      <td class="px-3 py-2">${employee.year}</td>
      <td class="px-3 py-2 flex space-x-2">
        <!-- Buttons are created with data attributes holding the employee ID -->
        <button class="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded"
          data-edit="${employee.id}">Edit</button>

        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          data-delete="${employee.id}">Delete</button>
      </td>
    `;

    // --- Attach event listeners to the newly created buttons ---

    // Find the 'Edit' button within this specific row and attach a click handler
    // When clicked, call the editemployee function with the correct employee ID
    row.querySelector("[data-edit]").onclick = () => editemployee(employee.id);
    
    // Find the 'Delete' button within this specific row and attach a click handler
    // When clicked, call the deleteemployeeAction function with the correct employee ID
    row.querySelector("[data-delete]").onclick = () => deleteemployeeAction(employee.id);

    // Append the fully constructed row to the table body
    body.appendChild(row);
  });
}