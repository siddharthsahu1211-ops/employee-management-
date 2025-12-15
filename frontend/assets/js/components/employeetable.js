import { $ } from "../utils/dom.js";
import { editEmployee, deleteEmployee } from "../controllers/employeecontroller.js";

export function renderEmployeeTable(employees) {
  const body = $("employeeTableBody");
  const noEmployee = $("noemployee");

  body.innerHTML = "";

  if (!employees || employees.length === 0) {
    noEmployee.style.display = "block";
    return;
  }

  noEmployee.style.display = "none";

  employees.forEach(emp => {
    const row = document.createElement("tr");
    row.className = "border-b";

    row.innerHTML = `
      <td class="px-3 py-2">${emp.id}</td>
      <td class="px-3 py-2">${emp.name}</td>
      <td class="px-3 py-2">${emp.email}</td>
      <td class="px-3 py-2">${emp.course || ""}</td>
      <td class="px-3 py-2">${emp.year || ""}</td>
      <td class="px-3 py-2 flex space-x-2">
        <button class="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded"
          data-edit="${emp.id}">Edit</button>
        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          data-delete="${emp.id}">Delete</button>
      </td>
    `;

    row.querySelector("[data-edit]").onclick = () => editEmployee(emp.id);
    row.querySelector("[data-delete]").onclick = () => deleteEmployee(emp.id);

    body.appendChild(row);
  });
}
