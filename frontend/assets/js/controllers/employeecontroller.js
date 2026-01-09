const $ = (id) => document.getElementById(id);
let state = { employees: [], editingId: null };

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
    const res = await fetch("/api/employee");
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

async function apiCreate(data) {
  return await fetch("/api/employee", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

async function apiUpdate(id, data) {
  return await fetch(`/api/employee/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

async function apiDelete(id) {
  return await fetch(`/api/employee/${id}`, { method: "DELETE" });
}

function renderTable(employees) {
  const tbody = $("employeeTableBody");
  if (!tbody) return;
  
  tbody.innerHTML = employees.length ? employees.map(e => `
    <tr class="hover:bg-gray-700/30 transition-all duration-300 group backdrop-blur-sm">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
            ${e.id}
          </div>
          <div>
            <div class="text-lg font-bold text-white">${e.name}</div>
            <div class="text-xs text-gray-400">ID: ${e.id}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
            <i class="fas fa-envelope text-white text-xs"></i>
          </div>
          <span class="text-sm font-medium text-white">${e.email}</span>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            <i class="fas fa-graduation-cap text-white text-xs"></i>
          </div>
          <span class="text-sm font-medium text-white">${e.course}</span>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
            <i class="fas fa-calendar text-white text-xs"></i>
          </div>
          <span class="text-sm font-medium text-white">${e.year}</span>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button onclick="editEmployee(${e.id})" class="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-1">
            <i class="fas fa-edit"></i><span>Edit</span>
          </button>
          <button onclick="deleteEmployee(${e.id})" class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-1">
            <i class="fas fa-trash"></i><span>Delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="5" class="px-6 py-12 text-center"><div class="flex flex-col items-center space-y-4"><div class="w-16 h-16 glass-effect rounded-full flex items-center justify-center"><i class="fas fa-user-plus text-gray-400 text-2xl"></i></div><p class="text-gray-300 text-lg font-bold">No employees found</p><p class="text-gray-500 text-sm">Add your first employee to get started</p></div></td></tr>';
}

async function loadEmployees() {
  const spinner = $("loadingSpinner");
  const table = $("employeeTableContainer");
  const noEmployee = $("noemployee");

  if (spinner) spinner.style.display = "block";
  if (table) table.style.display = "none";
  if (noEmployee) noEmployee.style.display = "none";

  try {
    state.employees = await apiGetAll();
    renderTable(state.employees);
    
    if (state.employees.length === 0) {
      if (noEmployee) noEmployee.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    showAlert("Failed to load employees", "error");
  } finally {
    if (spinner) spinner.style.display = "none";
    if (table) table.style.display = "block";
  }
}

window.editEmployee = function(id) {
  const item = state.employees.find(e => e.id === id);
  if (!item) return;
  
  state.editingId = id;
  $("name").value = item.name;
  $("email").value = item.email;
  $("course").value = item.course;
  $("year").value = item.year;
  $("cancelBtn").classList.remove("hidden");
  $("submitBtn").textContent = "Update Employee";
};

window.deleteEmployee = async function(id) {
  if (!confirm("Delete this employee record?")) return;
  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Employee deleted");
    loadEmployees();
  }
};

export function initEmployeeController() {
  const form = $("employeeForm");
  const cancelBtn = $("cancelBtn");
  
  if (!form) return;
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: $("name").value.trim(),
      email: $("email").value.trim(),
      course: $("course").value.trim(),
      year: $("year").value.trim()
    };

    const res = state.editingId 
      ? await apiUpdate(state.editingId, data)
      : await apiCreate(data);

    if (res.ok) {
      showAlert(state.editingId ? "Updated" : "Added");
      form.reset();
      if (cancelBtn) cancelBtn.classList.add("hidden");
      $("submitBtn").textContent = "Add Employee";
      state.editingId = null;
      loadEmployees();
    }
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      form.reset();
      cancelBtn.classList.add("hidden");
      $("submitBtn").textContent = "Add Employee";
      state.editingId = null;
    });
  }

  loadEmployees();
}
