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
    <tr class="hover:bg-gray-50 transition-colors duration-150">
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${p.id}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div class="flex items-center">
          <i class="fas fa-user-circle text-blue-500 mr-2"></i>
          ${p.employee_id}
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <i class="fas fa-dollar-sign mr-1"></i>
          ${parseFloat(p.salary).toFixed(2)}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <i class="fas fa-calendar-alt text-purple-500 mr-2"></i>
        ${p.month}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button onclick="editPayroll(${p.id})" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-150">
          <i class="fas fa-edit mr-1"></i>Edit
        </button>
        <button onclick="deletePayroll(${p.id})" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors duration-150">
          <i class="fas fa-trash mr-1"></i>Delete
        </button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="5" class="px-6 py-12 text-center text-gray-500"><div class="flex flex-col items-center"><i class="fas fa-inbox text-4xl text-gray-300 mb-2"></i><p>No payroll records found</p></div></td></tr>';
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
