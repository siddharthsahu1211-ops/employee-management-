import { $ } from "../utils/dom.js";
import { editComplaint, deleteComplaint } from "../controllers/complaintcontroller.js";

export function renderComplaintTable(complaints) {
  const body = $("complaintTableBody");
  const noComplaints = $("noComplaints");

  body.innerHTML = "";

  if (!complaints || complaints.length === 0) {
    noComplaints.style.display = "block";
    return;
  }

  noComplaints.style.display = "none";

  complaints.forEach(c => {
    const row = document.createElement("tr");
    row.className = "border-b";
    row.innerHTML = `
      <td class="px-3 py-2">${c.id}</td>
      <td class="px-3 py-2">${c.title}</td>
      <td class="px-3 py-2">${c.description}</td>
      <td class="px-3 py-2 flex space-x-2">
        <button class="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded" data-edit="${c.id}">Edit</button>
        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded" data-delete="${c.id}">Delete</button>
      </td>
    `;

    row.querySelector("[data-edit]").onclick = () => editComplaint(c.id);
    row.querySelector("[data-delete]").onclick = () => deleteComplaint(c.id);

    body.appendChild(row);
  });
}
