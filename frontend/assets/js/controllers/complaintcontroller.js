const $ = (id) => document.getElementById(id);
let state = { complaints: [], editingId: null };

function showAlert(message, type = "success") {
  const container = $("alertContainer");
  if (!container) {
    console.log(`${type.toUpperCase()}: ${message}`);
    return;
  }
  const el = document.createElement("div");
  el.className = `px-4 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ${type === "success" ? "bg-green-500" : "bg-red-500"} flex items-center space-x-2`;
  el.innerHTML = `<i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.transform = "translateX(100%)";
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

async function apiGetAll() {
  try {
    const res = await fetch("/api/complaints");
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

async function apiCreate(data) {
  return await fetch("/api/complaints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

async function apiUpdate(id, data) {
  return await fetch(`/api/complaints/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

async function apiDelete(id) {
  return await fetch(`/api/complaints/${id}`, { method: "DELETE" });
}

function renderTable(complaints) {
  const tbody = $("complaintTableBody");
  if (!tbody) return;
  
  tbody.innerHTML = complaints.length ? complaints.map(c => `
    <tr class="hover:bg-gray-700/30 transition-all duration-300 group backdrop-blur-sm">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
            ${c.id}
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-lg font-bold text-white">${c.title}</div>
      </td>
      <td class="px-6 py-4">
        <div class="text-sm text-gray-300 max-w-xs truncate">${c.description}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button onclick="editComplaint(${c.id})" class="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-1">
            <i class="fas fa-edit"></i><span>Edit</span>
          </button>
          <button onclick="deleteComplaint(${c.id})" class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-1">
            <i class="fas fa-trash"></i><span>Delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('') : '';
}

async function loadComplaints() {
  const spinner = $("loadingSpinner");
  const table = $("complaintTableContainer");
  const noComplaints = $("noComplaints");

  if (spinner) spinner.style.display = "block";
  if (table) table.style.display = "none";
  if (noComplaints) noComplaints.style.display = "none";

  try {
    state.complaints = await apiGetAll();
    renderTable(state.complaints);
    
    if (state.complaints.length === 0) {
      if (noComplaints) noComplaints.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    showAlert("Failed to load complaints", "error");
  } finally {
    if (spinner) spinner.style.display = "none";
    if (table) table.style.display = "block";
  }
}

window.editComplaint = function(id) {
  const item = state.complaints.find(c => c.id === id);
  if (!item) return;
  
  state.editingId = id;
  $("title").value = item.title;
  $("description").value = item.description;
  $("cancelBtn").classList.remove("hidden");
  $("submitBtn").textContent = "Update Complaint";
};

window.deleteComplaint = async function(id) {
  if (!confirm("Delete this complaint record?")) return;
  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Complaint deleted");
    loadComplaints();
  }
};

export function initComplaintController() {
  const form = $("complaintForm");
  const cancelBtn = $("cancelBtn");
  
  if (!form) return;
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      title: $("title").value.trim(),
      description: $("description").value.trim()
    };

    const res = state.editingId 
      ? await apiUpdate(state.editingId, data)
      : await apiCreate(data);

    if (res.ok) {
      showAlert(state.editingId ? "Updated" : "Added");
      form.reset();
      if (cancelBtn) cancelBtn.classList.add("hidden");
      $("submitBtn").textContent = "Submit Complaint";
      state.editingId = null;
      loadComplaints();
    }
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      form.reset();
      cancelBtn.classList.add("hidden");
      $("submitBtn").textContent = "Submit Complaint";
      state.editingId = null;
    });
  }

  loadComplaints();
}
