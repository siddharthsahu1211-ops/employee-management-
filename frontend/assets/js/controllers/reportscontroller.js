const $ = (id) => document.getElementById(id);
let state = { reports: [], employees: [], payroll: [], departments: [], filteredReports: [] };

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

async function fetchDepartments() {
  try {
    const res = await fetch("/api/departments");
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

async function fetchEmployees() {
  try {
    const res = await fetch("/api/employees");
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

async function fetchPayroll() {
  try {
    const res = await fetch("/api/payroll");
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

function joinEmployeePayroll(employees, payroll, departments) {
  return payroll.map(p => {
    const employee = employees.find(e => e.id === p.employee_id);
    const department = employee && employee.department_id ? 
      departments.find(d => d.id === employee.department_id) : null;
    
    return {
      employee_id: p.employee_id,
      name: employee ? employee.name : 'Unknown Employee',
      email: employee ? employee.email : 'N/A',
      department: department ? department.name : (employee ? employee.course : 'N/A'),
      salary: p.salary,
      month: p.month,
      payroll_id: p.id
    };
  });
}

function populateFilters() {
  const monthFilter = $("monthFilter");
  if (!monthFilter) return;
  
  const months = [...new Set(state.payroll.map(p => p.month))].sort();
  monthFilter.innerHTML = '<option value="">All Months</option>' + 
    months.map(month => `<option value="${month}">${month}</option>`).join('');
}

function applyFilters() {
  const monthFilter = $("monthFilter").value;
  const salaryFilter = $("salaryFilter").value;
  
  state.filteredReports = state.reports.filter(report => {
    let matchesMonth = !monthFilter || report.month === monthFilter;
    let matchesSalary = true;
    
    if (salaryFilter) {
      const salary = parseFloat(report.salary);
      if (salaryFilter === "0-50000") {
        matchesSalary = salary >= 0 && salary <= 50000;
      } else if (salaryFilter === "50000-100000") {
        matchesSalary = salary > 50000 && salary <= 100000;
      } else if (salaryFilter === "100000+") {
        matchesSalary = salary > 100000;
      }
    }
    
    return matchesMonth && matchesSalary;
  });
  
  renderTable(state.filteredReports);
  updateSummaryCards(state.filteredReports);
}

function updateSummaryCards(reports) {
  const totalEmployees = new Set(reports.map(r => r.employee_id)).size;
  const totalSalary = reports.reduce((sum, r) => sum + parseFloat(r.salary), 0);
  const avgSalary = reports.length > 0 ? totalSalary / reports.length : 0;
  const activeMonths = new Set(reports.map(r => r.month)).size;
  
  $("totalEmployees").textContent = totalEmployees;
  $("totalSalary").textContent = `₹${totalSalary.toLocaleString()}`;
  $("avgSalary").textContent = `₹${Math.round(avgSalary).toLocaleString()}`;
  $("activeMonths").textContent = activeMonths;
}

function renderTable(reports) {
  const tbody = $("reportTableBody");
  const noReports = $("noReports");
  const tableContainer = $("reportTableContainer");
  
  if (!tbody) return;
  
  if (reports.length === 0) {
    tableContainer.classList.add("hidden");
    noReports.classList.remove("hidden");
    return;
  }
  
  tableContainer.classList.remove("hidden");
  noReports.classList.add("hidden");
  
  tbody.innerHTML = reports.map(r => `
    <tr class="hover:bg-orange-500/10 hover:text-white transition-all duration-500 group backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/20">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
            ${r.employee_id}
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-user text-white text-xs"></i>
          </div>
          <div>
            <div class="text-sm font-bold text-white">${r.name}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-300">${r.email}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-building text-white text-xs"></i>
          </div>
          <span class="text-sm font-medium text-white">${r.department}</span>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
            <i class="fas fa-rupee-sign text-white text-xs"></i>
          </div>
          <div class="text-lg font-bold text-green-400">
            ₹${parseFloat(r.salary).toLocaleString()}
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            <i class="fas fa-calendar text-white text-xs"></i>
          </div>
          <span class="text-sm font-medium text-white">${r.month}</span>
        </div>
      </td>
    </tr>
  `).join('');
}

async function loadReports() {
  const spinner = $("loadingSpinner");
  const table = $("reportTableContainer");
  
  if (spinner) spinner.style.display = "block";
  if (table) table.style.display = "none";
  
  try {
    // Fetch employees, payroll, and departments data
    state.employees = await fetchEmployees();
    state.payroll = await fetchPayroll();
    state.departments = await fetchDepartments();
    
    // Perform join operation with departments
    state.reports = joinEmployeePayroll(state.employees, state.payroll, state.departments);
    state.filteredReports = [...state.reports];
    
    // Populate filters and render
    populateFilters();
    renderTable(state.filteredReports);
    updateSummaryCards(state.filteredReports);
    
    showAlert("Reports loaded successfully");
  } catch (err) {
    console.error(err);
    showAlert("Failed to load reports", "error");
  } finally {
    if (spinner) spinner.style.display = "none";
    if (table) table.style.display = "block";
  }
}

export function initReportsController() {
  const applyBtn = $("applyFilters");
  
  if (applyBtn) {
    applyBtn.addEventListener("click", applyFilters);
  }
  
  // Auto-apply filters when dropdowns change
  const monthFilter = $("monthFilter");
  const salaryFilter = $("salaryFilter");
  
  if (monthFilter) {
    monthFilter.addEventListener("change", applyFilters);
  }
  
  if (salaryFilter) {
    salaryFilter.addEventListener("change", applyFilters);
  }
  
  loadReports();
}