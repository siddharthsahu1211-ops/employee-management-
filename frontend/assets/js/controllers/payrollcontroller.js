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
    <tr class="hover:bg-orange-500/10 hover:text-white transition-all duration-500 group backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/20">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-xl flex items-center justify-center text-black font-bold text-sm shadow-lg">
            ${p.id}
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 metallic rounded-lg flex items-center justify-center">
            <i class="fas fa-user text-blue-400 text-xs"></i>
          </div>
          <div>
            <div class="text-sm font-bold text-white">Employee #${p.employee_id}</div>
            <div class="text-xs text-gray-400">ID: ${p.employee_id}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
            <i class="fas fa-rupee-sign text-white text-xs"></i>
          </div>
          <div class="text-lg font-bold text-green-400">
            ₹${parseFloat(p.salary).toLocaleString()}
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            <i class="fas fa-calendar text-white text-xs"></i>
          </div>
          <span class="text-sm font-medium text-white">${p.month}</span>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button onclick="editPayroll(${p.id})" class="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-orange-500 hover:to-red-600 hover:text-white text-black px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-lg flex items-center space-x-1">
            <i class="fas fa-edit"></i><span>Edit</span>
          </button>
          <button onclick="deletePayroll(${p.id})" class="bg-gradient-to-r from-red-500 to-red-600 hover:from-orange-500 hover:to-red-600 hover:text-white text-white px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-110 hover:-rotate-1 shadow-lg flex items-center space-x-1">
            <i class="fas fa-trash"></i><span>Delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="5" class="px-6 py-12 text-center"><div class="flex flex-col items-center space-y-4"><div class="w-16 h-16 glass-effect rounded-full flex items-center justify-center"><i class="fas fa-inbox text-gray-400 text-2xl"></i></div><p class="text-gray-300 text-lg font-bold">No payroll records found</p><p class="text-gray-500 text-sm">Add your first payroll record to get started</p></div></td></tr>';
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
