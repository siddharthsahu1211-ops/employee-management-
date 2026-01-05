const $ = (id) => document.getElementById(id);
let state = { payroll: [], editingId: null };

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
    const res = await fetch("/api/payroll");
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

async function apiCreate(data) {
  return await fetch("/api/payroll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

async function apiUpdate(id, data) {
  return await fetch(`/api/payroll/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

async function apiDelete(id) {
  return await fetch(`/api/payroll/${id}`, { method: "DELETE" });
}

function renderTable(payroll) {
  const tbody = $("payrollTableBody");
  if (!tbody) return;
  
  tbody.innerHTML = payroll.length ? payroll.map(p => `
    <tr class="hover:bg-blue-50 transition-colors duration-200 group">
      <td class="px-8 py-6 whitespace-nowrap">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            ${p.id}
          </div>
        </div>
      </td>
      <td class="px-8 py-6 whitespace-nowrap">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <i class="fas fa-user text-gray-600"></i>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-900">Employee #${p.employee_id}</div>
            <div class="text-sm text-gray-500">ID: ${p.employee_id}</div>
          </div>
        </div>
      </td>
      <td class="px-8 py-6 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-dollar-sign text-green-600 text-sm"></i>
          </div>
          <span class="text-lg font-semibold text-gray-900">${parseFloat(p.salary).toLocaleString()}</span>
        </div>
      </td>
      <td class="px-8 py-6 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-calendar text-purple-600 text-sm"></i>
          </div>
          <span class="text-sm font-medium text-gray-700">${p.month}</span>
        </div>
      </td>
      <td class="px-8 py-6 whitespace-nowrap">
        <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onclick="editPayroll(${p.id})" class="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-1">
            <i class="fas fa-edit"></i><span>Edit</span>
          </button>
          <button onclick="deletePayroll(${p.id})" class="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-1">
            <i class="fas fa-trash"></i><span>Delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="5" class="px-8 py-16 text-center"><div class="flex flex-col items-center space-y-4"><div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"><i class="fas fa-inbox text-gray-400 text-2xl"></i></div><p class="text-gray-500 text-lg font-medium">No payroll records found</p><p class="text-gray-400 text-sm">Add your first payroll record to get started</p></div></td></tr>';
}

async function loadPayroll() {
  state.payroll = await apiGetAll();
  renderTable(state.payroll);
}

window.editPayroll = function(id) {
  const item = state.payroll.find(p => p.id === id);
  if (!item) return;
  
  state.editingId = id;
  $("employee_id").value = item.employee_id;
  $("salary").value = item.salary;
  $("month").value = item.month;
  $("cancelPayrollBtn").style.display = "inline-block";
  $("payrollForm").querySelector('button[type="submit"]').textContent = "Update Payroll";
};

window.deletePayroll = async function(id) {
  if (!confirm("Delete this payroll record?")) return;
  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Payroll deleted");
    loadPayroll();
  }
};

export function initPayrollController() {
  const form = $("payrollForm");
  const cancelBtn = $("cancelPayrollBtn");
  
  if (!form) return;
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      employee_id: parseInt($("employee_id").value),
      salary: parseFloat($("salary").value),
      month: $("month").value.trim()
    };

    const res = state.editingId 
      ? await apiUpdate(state.editingId, data)
      : await apiCreate(data);

    if (res.ok) {
      showAlert(state.editingId ? "Updated" : "Added");
      form.reset();
      if (cancelBtn) cancelBtn.style.display = "none";
      form.querySelector('button[type="submit"]').textContent = "Add Payroll";
      state.editingId = null;
      loadPayroll();
    }
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      form.reset();
      cancelBtn.style.display = "none";
      form.querySelector('button[type="submit"]').textContent = "Add Payroll";
      state.editingId = null;
    });
  }

  loadPayroll();
}
