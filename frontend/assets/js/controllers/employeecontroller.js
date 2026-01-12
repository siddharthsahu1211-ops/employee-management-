const $ = (id) => document.getElementById(id);
let state = { employees: [], departments: [], editingId: null };

function showAlert(message, type = "success") {
  const container = $("alertContainer");
  if (!container) {
    console.log(`${type.toUpperCase()}: ${message}`);
    return;
  }
  const el = document.createElement("div");
  el.className = `alert alert-${type} px-6 py-4 text-white font-medium flex items-center space-x-3 min-w-80 max-w-md`;
  
  const iconClass = type === "success" ? "fa-check" : "fa-exclamation-triangle";
  el.innerHTML = `
    <div class="alert-icon">
      <i class="fas ${iconClass}"></i>
    </div>
    <div class="flex-1">
      <div class="font-bold text-sm">${type === "success" ? "Success" : "Error"}</div>
      <div class="text-xs opacity-90">${message}</div>
    </div>
    <button onclick="this.parentElement.classList.add('alert-exit'); setTimeout(() => this.parentElement.remove(), 300)" class="text-white/70 hover:text-white transition-colors">
      <i class="fas fa-times text-xs"></i>
    </button>
  `;
  
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('alert-exit');
    setTimeout(() => el.remove(), 300);
  }, 4000);
}

async function loadDepartments() {
  try {
    const res = await fetch("/api/departments");
    state.departments = res.ok ? await res.json() : [];
    
    const select = $("department_id");
    if (select) {
      select.innerHTML = '<option value="">Select Department</option>' + 
        state.departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
    }
  } catch (err) {
    console.error("Failed to load departments:", err);
    const select = $("department_id");
    if (select) {
      select.innerHTML = '<option value="">No departments available</option>';
    }
  }
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
    <tr class="backdrop-blur-sm">
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
          <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
            <i class="fas fa-building text-white text-xs"></i>
          </div>
          <span class="text-sm font-medium text-white">${e.department_name || 'N/A'}</span>
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
        <div class="flex justify-center space-x-2">
          <button onclick="editEmployee(${e.id})" class="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-orange-500 hover:to-red-600 hover:text-white text-black px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-lg flex items-center space-x-1">
            <i class="fas fa-edit"></i><span>Edit</span>
          </button>
          <button onclick="deleteEmployee(${e.id})" class="bg-gradient-to-r from-red-500 to-red-600 hover:from-orange-500 hover:to-red-600 hover:text-white text-white px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-110 hover:-rotate-1 shadow-lg flex items-center space-x-1">
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
  $("year").value = item.year;
  $("department_id").value = item.department_id || '';
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
      year: $("year").value.trim(),
      department_id: parseInt($("department_id").value) || null
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

  loadDepartments();
  loadEmployees();
}
