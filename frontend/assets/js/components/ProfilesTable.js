// frontend/assets/js/components/ProfilesTable.js
// Render the profiles directory table

import { $ } from "../utils/dom.js";

export function renderProfilesTable(employees) {
  const body = $("profilesTableBody");
  const noProfiles = $("noProfiles");

  if (!body) return;

  body.innerHTML = "";

  if (!employees || employees.length === 0) {
    if (noProfiles) noProfiles.style.display = "block";
    return;
  }

  if (noProfiles) noProfiles.style.display = "none";

  employees.forEach((emp) => {
    const tr = document.createElement("tr");
    tr.className = "border-b";

    tr.innerHTML = `
      <td class="px-3 py-2">${emp.id}</td>

      <td class="px-3 py-2">
        <a href="/profiles/${emp.id}" data-link class="text-blue-600 hover:underline font-medium">
          ${emp.name}
        </a>
      </td>

      <td class="px-3 py-2">${emp.email}</td>
      <td class="px-3 py-2">${emp.department}</td>
      <td class="px-3 py-2">${emp.position}</td>

      <td class="px-3 py-2">
        <a href="/profiles/${emp.id}" data-link
          class="inline-flex items-center justify-center px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">
          View
        </a>
      </td>
    `;

    body.appendChild(tr);
  });
}
