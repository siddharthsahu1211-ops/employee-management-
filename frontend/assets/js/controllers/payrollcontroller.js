import { apiGetAll, apiCreate } from "../services/payrollservice.js";

export function initPayrollController() {
  loadPayroll();

  document.getElementById("payrollForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      employee_id: document.getElementById("employee_id").value,
      salary: document.getElementById("salary").value
    };

    await apiCreate(data);
    e.target.reset();
    loadPayroll();
  });
}

async function loadPayroll() {
  const rows = await apiGetAll();
  const body = document.getElementById("payrollTable");
  body.innerHTML = "";

  rows.forEach(p => {
    body.innerHTML += `
      <tr>
        <td class="p-2">${p.id}</td>
        <td class="p-2">${p.employee_id}</td>
        <td class="p-2">${p.salary}</td>
      </tr>
    `;
  });
}
