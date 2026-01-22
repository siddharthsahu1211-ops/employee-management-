const $ = (id) => document.getElementById(id);
let state = { employees: [], departments: [], editingId: null, selectedEmployeeId: null };

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

function viewProfile(employeeId) {
  // Navigate to profile page with employee ID
  window.location.href = `/profile/${employeeId}`;
}

async function showEmployeeModal(employeeId, name, email) {
  // Show basic info first
  $("modalEmployeeId").textContent = employeeId;
  $("modalEmployeeName").textContent = name;
  $("modalEmployeeEmail").textContent = email;
  
  // Hide full profile section, show basic info
  $("basicInfoSection").classList.remove("hidden");
  $("fullProfileSection").classList.add("hidden");
  
  // Show modal
  $("employeeModal").classList.remove("hidden");
  
  // Store employee ID for full profile loading
  state.selectedEmployeeId = employeeId;
}

function closeEmployeeModal() {
  $("employeeModal").classList.add("hidden");
  state.selectedEmployeeId = null;
}

async function showFullProfile() {
  if (!state.selectedEmployeeId) return;
  
  // Show loading state
  $("modalPayrollHistory").innerHTML = '<div class="text-center py-4"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div></div>';
  $("modalComplaintsHistory").innerHTML = '<div class="text-center py-4"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div></div>';
  
  try {
    // Fetch full profile data
    const response = await fetch(`/api/profile/${state.selectedEmployeeId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch employee profile");
    }
    
    const data = await response.json();
    const employee = data.employee;
    
    // Populate full profile data
    $("modalEmployeeDepartment").textContent = employee.department_name || 'N/A';
    $("modalEmployeeYear").textContent = employee.year;
    
    // Populate payroll history
    if (data.payroll_history && data.payroll_history.length > 0) {
      $("modalPayrollHistory").innerHTML = data.payroll_history.map(p => `
        <div class="flex justify-between items-center bg-gray-700/50 rounded-lg p-3">
          <div class="flex items-center space-x-2">
            <i class="fas fa-calendar text-orange-400"></i>
            <span class="text-white">${p.month}</span>
          </div>
          <div class="flex items-center space-x-2">
            <i class="fas fa-dollar-sign text-green-400"></i>
            <span class="text-white font-semibold">$${p.salary}</span>
          </div>
        </div>
      `).join('');
      $("modalNoPayroll").classList.add("hidden");
    } else {
      $("modalPayrollHistory").innerHTML = '';
      $("modalNoPayroll").classList.remove("hidden");
    }
    
    // Populate complaints history
    if (data.complaints && data.complaints.length > 0) {
      $("modalComplaintsHistory").innerHTML = data.complaints.map(c => `
        <div class="bg-gray-700/50 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <i class="fas fa-exclamation-triangle text-red-400 mt-1"></i>
            <div class="flex-1">
              <h4 class="text-white font-semibold">${c.title}</h4>
              <p class="text-gray-300 text-sm mt-1">${c.description}</p>
              <p class="text-gray-400 text-xs mt-2">${new Date(c.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      `).join('');
      $("modalNoComplaints").classList.add("hidden");
    } else {
      $("modalComplaintsHistory").innerHTML = '';
      $("modalNoComplaints").classList.remove("hidden");
    }
    
    // Switch to full profile view
    $("basicInfoSection").classList.add("hidden");
    $("fullProfileSection").classList.remove("hidden");
    
  } catch (error) {
    console.error("Error loading full profile:", error);
    showAlert("Failed to load full profile", "error");
  }
}

function showBasicInfo() {
  // Switch back to basic info view
  $("basicInfoSection").classList.remove("hidden");
  $("fullProfileSection").classList.add("hidden");
}

function renderTable(employees) {
  const tbody = $("employeeTableBody");
  if (!tbody) return;
  
  tbody.innerHTML = employees.length ? employees.map(e => `
    <tr class="backdrop-blur-sm hover:bg-gray-800/30 transition-colors cursor-pointer" onclick="showEmployeeModal(${e.id}, '${e.name}', '${e.email}')">
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
          <button onclick="editEmployee(${e.id}); event.stopPropagation()" class="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-orange-500 hover:to-red-600 hover:text-white text-black px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-lg flex items-center space-x-1">
            <i class="fas fa-edit"></i><span>Edit</span>
          </button>
          <button onclick="deleteEmployee(${e.id}); event.stopPropagation()" class="bg-gradient-to-r from-red-500 to-red-600 hover:from-orange-500 hover:to-red-600 hover:text-white text-white px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-110 hover:-rotate-1 shadow-lg flex items-center space-x-1">
            <i class="fas fa-trash"></i><span>Delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('') : '';
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

window.viewProfile = function(id) {
  window.location.href = `/profile?id=${id}`;
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

// Global functions for modal
if (!window.profilePageLoaded) {
  window.showEmployeeModal = showEmployeeModal;
  window.closeEmployeeModal = closeEmployeeModal;
  window.showFullProfile = showFullProfile;
  window.showBasicInfo = showBasicInfo;
}
