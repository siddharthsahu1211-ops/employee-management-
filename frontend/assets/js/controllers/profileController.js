// frontend/assets/js/controllers/profileController.js
// Controller for individual employee profile page

import { $ } from "../utils/dom.js";
import { fetchEmployeeById } from "../services/profilesService.js";
import { setProfileLoading, renderEmployeeBasic, renderProfileError } from "../components/ProfileView.js";

export async function initProfileController(employeeId) {
  setProfileLoading(true);

  try {
    const employee = await fetchEmployeeById(employeeId);

    if (!employee) {
      throw new Error("Employee not found");
    }

    // Render UI
    renderEmployeeBasic(employee);

    // Wire export buttons
    $("exportPdfBtn")?.addEventListener("click", () => {
      exportEmployeePDF(employee);
    });

    $("exportCsvBtn")?.addEventListener("click", () => {
      exportEmployeeCSV(employee);
    });

    setProfileLoading(false);
  } catch (err) {
    console.error("[profileController] error:", err);
    renderProfileError();
  }
}

function exportEmployeePDF(employee) {
  const w = window.open("", "_blank");
  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Employee ${employee.id} - ${employee.name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .detail { margin: 10px 0; }
        .label { font-weight: bold; color: #666; }
      </style>
    </head>
    <body>
      <h1>Employee Profile</h1>
      <div class="detail"><span class="label">ID:</span> ${employee.id}</div>
      <div class="detail"><span class="label">Name:</span> ${employee.name}</div>
      <div class="detail"><span class="label">Email:</span> ${employee.email}</div>
      <div class="detail"><span class="label">Department:</span> ${employee.department}</div>
      <div class="detail"><span class="label">Position:</span> ${employee.position}</div>
      <div class="detail"><span class="label">Salary:</span> $${Number(employee.salary).toLocaleString()}</div>
      <div class="detail"><span class="label">Join Date:</span> ${employee.joinDate}</div>
    </body>
    </html>
  `);
  w.document.close();
  w.print();
}

function exportEmployeeCSV(employee) {
  const csv = [
    ["Field", "Value"],
    ["ID", employee.id],
    ["Name", employee.name],
    ["Email", employee.email],
    ["Department", employee.department],
    ["Position", employee.position],
    ["Salary", employee.salary],
    ["Join Date", employee.joinDate],
  ]
    .map((row) => row.map((v) => `"${v}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `employee_${employee.id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
