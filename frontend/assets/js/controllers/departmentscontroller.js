const $ = (id) => document.getElementById(id);
let state = { departments: [], editingId: null };

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
    const res = await fetch("/api/departments");
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

async function apiCreate(data) {
  return await fetch("/api/departments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

async function apiUpdate(id, data) {
  return await fetch(`/api/departments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

async function apiDelete(id) {
  return await fetch(`/api/departments/${id}`, { method: "DELETE" });
}

function renderTable(departments) {
  const tbody = $("departmentTableBody");
  if (!tbody) return;
  
  tbody.innerHTML = departments.length ? departments.map(d => `
    <tr class="hover:bg-orange-500/10 hover:text-white transition-all duration-500 group backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/20">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
            ${d.id}
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-building text-white text-xs"></i>
          </div>
          <div>
            <div class="text-sm font-bold text-white">${d.name}</div>
            <div class="text-xs text-gray-400">${d.description || 'No description'}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-user-tie text-white text-xs"></i>
          </div>
          <span class="text-sm font-medium text-white">${d.manager}</span>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
            <i class="fas fa-rupee-sign text-white text-xs"></i>
          </div>
          <div class="text-lg font-bold text-yellow-400">
            ₹${parseFloat(d.budget).toLocaleString()}
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-map-marker-alt text-white text-xs"></i>
          </div>
          <span class="text-sm font-medium text-white">${d.location}</span>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button onclick="editDepartment(${d.id})" class="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-orange-500 hover:to-red-600 hover:text-white text-black px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-lg flex items-center space-x-1">
            <i class="fas fa-edit"></i><span>Edit</span>
          </button>
          <button onclick="deleteDepartment(${d.id})" class="bg-gradient-to-r from-red-500 to-red-600 hover:from-orange-500 hover:to-red-600 hover:text-white text-white px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-110 hover:-rotate-1 shadow-lg flex items-center space-x-1">
            <i class="fas fa-trash"></i><span>Delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('') : '';
}

async function loadDepartments() {
  const spinner = $("loadingSpinner");
  const table = $("departmentTableContainer");
  const noDepartments = $("noDepartments");

  if (spinner) spinner.style.display = "block";
  if (table) table.style.display = "none";
  if (noDepartments) noDepartments.style.display = "none";

  try {
    state.departments = await apiGetAll();
    renderTable(state.departments);
    
    if (state.departments.length === 0) {
      if (noDepartments) noDepartments.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    showAlert("Failed to load departments", "error");
  } finally {
    if (spinner) spinner.style.display = "none";
    if (table) table.style.display = "block";
  }
}

window.editDepartment = function(id) {
  const item = state.departments.find(d => d.id === id);
  if (!item) return;
  
  state.editingId = id;
  $("name").value = item.name;
  $("manager").value = item.manager;
  $("budget").value = item.budget;
  $("location").value = item.location;
  $("description").value = item.description || '';
  $("cancelBtn").classList.remove("hidden");
  $("submitBtn").innerHTML = '<i class="fas fa-save"></i><span>Update Department</span>';
};

window.deleteDepartment = async function(id) {
  if (!confirm("Delete this department? This action cannot be undone.")) return;
  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Department deleted successfully");
    loadDepartments();
  } else {
    showAlert("Failed to delete department", "error");
  }
};

export function initDepartmentsController() {
  const form = $("departmentForm");
  const cancelBtn = $("cancelBtn");
  
  if (!form) return;
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: $("name").value.trim(),
      manager: $("manager").value.trim(),
      budget: parseFloat($("budget").value),
      location: $("location").value.trim(),
      description: $("description").value.trim()
    };

    const res = state.editingId 
      ? await apiUpdate(state.editingId, data)
      : await apiCreate(data);

    if (res.ok) {
      showAlert(state.editingId ? "Department updated successfully" : "Department added successfully");
      form.reset();
      if (cancelBtn) cancelBtn.classList.add("hidden");
      $("submitBtn").innerHTML = '<i class="fas fa-plus"></i><span>Add Department</span>';
      state.editingId = null;
      loadDepartments();
    } else {
      showAlert("Failed to save department", "error");
    }
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      form.reset();
      cancelBtn.classList.add("hidden");
      $("submitBtn").innerHTML = '<i class="fas fa-plus"></i><span>Add Department</span>';
      state.editingId = null;
    });
  }

  loadDepartments();
}