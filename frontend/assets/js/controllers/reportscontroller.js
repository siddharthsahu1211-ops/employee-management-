import { exportToCSV, exportToPDF } from "../utils/exportTools.js";
import { filterList, sortList } from "../utils/listTools.js";
import { showSkeleton, hideSkeleton } from "../utils/skeleton.js";

const $ = (id) => document.getElementById(id);
let state = { 
  reports: [], 
  employees: [], 
  payroll: [], 
  departments: [], 
  filteredReports: [], 
  filteredEmployees: [],
  currentProfile: null 
};

function showAlert(message, type = "success") {
  const container = $("alertContainer");
  if (!container) {
    console.log(`${type.toUpperCase()}: ${message}`);
    return;
  }
  const el = document.createElement("div");
  el.className = `px-6 py-4 rounded-2xl shadow-2xl text-white transform transition-all duration-500 ${type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-red-600"} flex items-center space-x-3 backdrop-blur-sm border border-white/20 relative z-50`;
  el.innerHTML = `
    <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
      <i class="fas ${type === "success" ? "fa-check" : "fa-exclamation-triangle"} text-sm"></i>
    </div>
    <span class="font-medium">${message}</span>
    <button onclick="this.parentElement.remove()" class="ml-auto w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
      <i class="fas fa-times text-xs"></i>
    </button>
  `;
  container.appendChild(el);
  setTimeout(() => {
    el.style.transform = "translateX(100%) scale(0.8)";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 4000);
}

async function fetchProfile(employeeId) {
  try {
    const res = await fetch(`/api/profile/${employeeId}`);
    return res.ok ? await res.json() : null;
  } catch { return null; }
}

function showEmployeeProfile(employee) {
  const modal = $("employeeProfileModal");
  if (!modal || !employee) return;
  
  // Set basic info
  $("modalEmployeeId").textContent = employee.id;
  $("modalEmployeeName").textContent = employee.name || "-";
  $("modalEmployeeEmail").textContent = employee.email || "-";
  $("modalEmployeeDepartment").textContent = employee.course || employee.department || "-";
  $("modalEmployeeSalary").textContent = employee.salary ? `₹${parseFloat(employee.salary).toLocaleString()}` : "-";
  $("modalEmployeeYear").textContent = employee.year || "-";
  
  // Load full profile data
  loadFullProfile(employee.id);
  
  modal.classList.remove("hidden");
}

async function loadFullProfile(employeeId) {
  try {
    const profile = await fetchProfile(employeeId);
    state.currentProfile = profile;
    
    if (profile) {
      displayPayrollHistory(profile.payroll_history || []);
      displayComplaintsHistory(profile.complaints || []);
    }
  } catch (err) {
    console.error("Error loading full profile:", err);
  }
}

function displayPayrollHistory(payrollHistory) {
  const container = $("modalPayrollHistory");
  const noPayroll = $("modalNoPayroll");
  
  if (!payrollHistory || payrollHistory.length === 0) {
    container.classList.add("hidden");
    noPayroll.classList.remove("hidden");
    return;
  }
  
  container.classList.remove("hidden");
  noPayroll.classList.add("hidden");
  
  container.innerHTML = payrollHistory.map(p => `
    <div class="bg-gray-700/50 rounded-lg p-4 flex justify-between items-center">
      <div>
        <div class="text-white font-medium">${p.month}</div>
        <div class="text-gray-400 text-sm">Payroll Record</div>
      </div>
      <div class="text-green-400 font-bold text-lg">₹${parseFloat(p.salary).toLocaleString()}</div>
    </div>
  `).join('');
}

function displayComplaintsHistory(complaints) {
  const container = $("modalComplaintsHistory");
  const noComplaints = $("modalNoComplaints");
  
  if (!complaints || complaints.length === 0) {
    container.classList.add("hidden");
    noComplaints.classList.remove("hidden");
    return;
  }
  
  container.classList.remove("hidden");
  noComplaints.classList.add("hidden");
  
  container.innerHTML = complaints.map(c => `
    <div class="bg-gray-700/50 rounded-lg p-4">
      <div class="flex justify-between items-start mb-2">
        <div class="text-white font-medium">${c.title || 'Complaint'}</div>
        <div class="text-xs px-2 py-1 rounded ${c.status === 'resolved' ? 'bg-green-600' : c.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'} text-white">
          ${c.status || 'Open'}
        </div>
      </div>
      <div class="text-gray-400 text-sm">${c.description || 'No description'}</div>
      <div class="text-gray-500 text-xs mt-2">${c.date || 'No date'}</div>
    </div>
  `).join('');
}

function exportEmployeeProfile(format) {
  if (!state.currentProfile || !state.currentProfile.employee) {
    showAlert("No employee profile loaded", "error");
    return;
  }
  
  const emp = state.currentProfile.employee;
  const data = {
    id: emp.id,
    name: emp.name,
    email: emp.email,
    department: emp.course || emp.department,
    salary: emp.salary,
    year: emp.year,
    payroll_records: state.currentProfile.payroll_history?.length || 0,
    complaints: state.currentProfile.complaints?.length || 0
  };
  
  if (format === 'csv') {
    const columns = [
      { key: "id", label: "Employee ID" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "department", label: "Department" },
      { key: "salary", label: "Salary" },
      { key: "year", label: "Year" },
      { key: "payroll_records", label: "Payroll Records" },
      { key: "complaints", label: "Complaints" }
    ];
    const filename = `employee_${emp.id}_${emp.name?.replace(/\s+/g, '_')}_profile.csv`;
    exportToCSV(filename, [data], columns);
    showAlert("Employee profile exported to CSV", "success");
  } else if (format === 'pdf') {
    const htmlContent = `
      <h1>Employee Profile Report</h1>
      <div class="meta">Generated on: ${new Date().toLocaleString()}</div>
      <h2>Basic Information</h2>
      <table>
        <tr><td><strong>Employee ID:</strong></td><td>${emp.id}</td></tr>
        <tr><td><strong>Name:</strong></td><td>${emp.name}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${emp.email}</td></tr>
        <tr><td><strong>Department:</strong></td><td>${emp.course || emp.department}</td></tr>
        <tr><td><strong>Salary:</strong></td><td>₹${emp.salary}</td></tr>
        <tr><td><strong>Year:</strong></td><td>${emp.year}</td></tr>
      </table>
      <h2>Summary</h2>
      <p>Payroll Records: ${state.currentProfile.payroll_history?.length || 0}</p>
      <p>Complaints: ${state.currentProfile.complaints?.length || 0}</p>
    `;
    exportToPDF(`Employee Profile - ${emp.name}`, htmlContent);
    showAlert("Employee profile exported to PDF", "success");
  }
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
  
  state.filteredReports = state.reports.filter(report => {
    let matchesMonth = !monthFilter || report.month === monthFilter;
    return matchesMonth;
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
    <tr class="backdrop-blur-sm">
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

function renderEmployeeTable(employees) {
  const tbody = $("employeeTableBody");
  const noEmployees = $("noEmployees");
  const tableContainer = $("employeeTableContainer");
  
  if (!tbody) return;
  
  if (employees.length === 0) {
    tableContainer.classList.add("hidden");
    noEmployees.classList.remove("hidden");
    return;
  }
  
  tableContainer.classList.remove("hidden");
  noEmployees.classList.add("hidden");
  
  tbody.innerHTML = employees.map(emp => {
    // Find latest payroll for this employee
    const latestPayroll = state.payroll
      .filter(p => p.employee_id === emp.id)
      .sort((a, b) => new Date(b.month) - new Date(a.month))[0];
    
    const payrollCount = state.payroll.filter(p => p.employee_id === emp.id).length;
    
    return `
      <tr class="backdrop-blur-sm hover:bg-gray-800/50 cursor-pointer" onclick="showEmployeeProfile(${JSON.stringify(emp).replace(/"/g, '&quot;')})">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
              ${emp.id}
            </div>
            <div>
              <div class="text-sm font-bold text-white">${emp.name}</div>
              <div class="text-xs text-gray-400">ID: ${emp.id}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-300">${emp.email}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-building text-white text-xs"></i>
            </div>
            <span class="text-sm font-medium text-white">${emp.course || emp.department || 'N/A'}</span>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <i class="fas fa-rupee-sign text-white text-xs"></i>
            </div>
            <div class="text-lg font-bold text-green-400">
              ${emp.salary ? `₹${parseFloat(emp.salary).toLocaleString()}` : 'N/A'}
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="space-y-1">
            ${latestPayroll ? `
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <i class="fas fa-calendar text-white text-xs"></i>
                </div>
                <span class="text-sm font-medium text-white">${latestPayroll.month}</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <i class="fas fa-money-bill-wave text-white text-xs"></i>
                </div>
                <span class="text-sm font-bold text-green-400">₹${parseFloat(latestPayroll.salary).toLocaleString()}</span>
              </div>
            ` : `
              <div class="text-xs text-gray-500">No payroll records</div>
            `}
            <div class="text-xs text-gray-400">${payrollCount} payroll record${payrollCount !== 1 ? 's' : ''}</div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <button class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all duration-200">
            <i class="fas fa-eye mr-1"></i>View Profile
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function applyEmployeeFilters() {
  const searchTerm = $("employeeSearch").value;
  const sortBy = $("sortBy").value;
  const sortOrder = $("sortOrder").value;
  
  // Filter employees
  let filtered = filterList(state.employees, searchTerm, ['name', 'email', 'course', 'department']);
  
  // Sort employees
  filtered = sortList(filtered, sortBy, sortOrder);
  
  state.filteredEmployees = filtered;
  renderEmployeeTable(filtered);
}

async function loadEmployees() {
  const spinner = $("loadingSpinner");
  const table = $("employeeTableContainer");
  const tbody = $("employeeTableBody");
  
  if (spinner) spinner.style.display = "block";
  if (table) table.classList.add("hidden");
  if (tbody) showSkeleton('employeeTableBody', 'table', 5);
  
  try {
    // Load all data
    state.employees = await fetchEmployees();
    state.payroll = await fetchPayroll();
    state.departments = await fetchDepartments();
    
    // Create combined reports for summary
    state.reports = joinEmployeePayroll(state.employees, state.payroll, state.departments);
    state.filteredReports = [...state.reports];
    state.filteredEmployees = [...state.employees];
    
    // Populate filters and render
    populateFilters();
    renderEmployeeTable(state.filteredEmployees);
    updateSummaryCards(state.filteredReports);
    
    // showAlert("Employee directory loaded successfully");
  } catch (err) {
    console.error(err);
    showAlert("Failed to load employee directory", "error");
  } finally {
    if (spinner) spinner.style.display = "none";
    if (table) table.classList.remove("hidden");
  }
}

async function loadReports() {
  const spinner = $("loadingSpinner");
  const table = $("employeeTableContainer");
  
  if (spinner) spinner.style.display = "block";
  if (table) table.classList.add("hidden");
  
  try {
    // Fetch payroll and departments data
    state.payroll = await fetchPayroll();
    state.departments = await fetchDepartments();
    
    // Perform join operation with departments
    state.reports = joinEmployeePayroll(state.employees, state.payroll, state.departments);
    state.filteredReports = [...state.reports];
    
    // Populate filters and render
    populateFilters();
    renderTable(state.filteredReports);
    updateSummaryCards(state.filteredReports);
    
    showAlert("Payroll reports loaded successfully");
  } catch (err) {
    console.error(err);
    showAlert("Failed to load payroll reports", "error");
  } finally {
    if (spinner) spinner.style.display = "none";
    if (table) table.classList.remove("hidden");
  }
}

function exportReportsToCSV() {
  // Export combined employee and payroll data
  const combinedData = state.filteredEmployees.map(emp => {
    const latestPayroll = state.payroll
      .filter(p => p.employee_id === emp.id)
      .sort((a, b) => new Date(b.month) - new Date(a.month))[0];
    
    return {
      employee_id: emp.id,
      name: emp.name,
      email: emp.email,
      department: emp.course || emp.department || 'N/A',
      base_salary: emp.salary || 'N/A',
      latest_payroll_month: latestPayroll ? latestPayroll.month : 'N/A',
      latest_payroll_amount: latestPayroll ? latestPayroll.salary : 'N/A',
      total_payroll_records: state.payroll.filter(p => p.employee_id === emp.id).length
    };
  });
  
  const columns = [
    { key: "employee_id", label: "Employee ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "base_salary", label: "Base Salary" },
    { key: "latest_payroll_month", label: "Latest Payroll Month" },
    { key: "latest_payroll_amount", label: "Latest Payroll Amount" },
    { key: "total_payroll_records", label: "Total Payroll Records" }
  ];

  const filename = `employee_directory_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(filename, combinedData, columns);
  showAlert("Employee directory exported to CSV", "success");
}

function exportReportsToPDF() {
  const combinedData = state.filteredEmployees.map(emp => {
    const latestPayroll = state.payroll
      .filter(p => p.employee_id === emp.id)
      .sort((a, b) => new Date(b.month) - new Date(a.month))[0];
    
    return {
      employee_id: emp.id,
      name: emp.name,
      email: emp.email,
      department: emp.course || emp.department || 'N/A',
      base_salary: emp.salary || 'N/A',
      latest_payroll_month: latestPayroll ? latestPayroll.month : 'N/A',
      latest_payroll_amount: latestPayroll ? latestPayroll.salary : 'N/A',
      total_payroll_records: state.payroll.filter(p => p.employee_id === emp.id).length
    };
  });
  
  const htmlContent = `
    <h1>Employee Directory & Payroll Report</h1>
    <div class="meta">Generated on: ${new Date().toLocaleString()}</div>
    <table>
      <thead>
        <tr>
          <th>Employee ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Base Salary</th>
          <th>Latest Payroll</th>
          <th>Payroll Records</th>
        </tr>
      </thead>
      <tbody>
        ${combinedData.map(row => `
          <tr>
            <td>${row.employee_id}</td>
            <td>${row.name}</td>
            <td>${row.email}</td>
            <td>${row.department}</td>
            <td>₹${row.base_salary}</td>
            <td>${row.latest_payroll_month} (₹${row.latest_payroll_amount})</td>
            <td>${row.total_payroll_records}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  exportToPDF("Employee Directory & Payroll Report", htmlContent);
  showAlert("Employee directory exported to PDF", "success");
}

export function initReportsController() {
  // Employee search and sort functionality
  const employeeSearch = $("employeeSearch");
  const sortBy = $("sortBy");
  const sortOrder = $("sortOrder");
  
  if (employeeSearch) {
    employeeSearch.addEventListener("input", applyEmployeeFilters);
  }
  
  if (sortBy) {
    sortBy.addEventListener("change", applyEmployeeFilters);
  }
  
  if (sortOrder) {
    sortOrder.addEventListener("change", applyEmployeeFilters);
  }
  
  // Modal functionality
  const closeModal = $("closeProfileModal");
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      $("employeeProfileModal").classList.add("hidden");
    });
  }
  
  // Export individual employee profile
  const exportEmployeeCSVBtn = $("exportEmployeeCSV");
  const exportEmployeePDFBtn = $("exportEmployeePDF");
  
  if (exportEmployeeCSVBtn) {
    exportEmployeeCSVBtn.addEventListener("click", () => exportEmployeeProfile('csv'));
  }
  
  if (exportEmployeePDFBtn) {
    exportEmployeePDFBtn.addEventListener("click", () => exportEmployeeProfile('pdf'));
  }
  
  // Month filter for summary cards
  const monthFilter = $("monthFilter");
  if (monthFilter) {
    monthFilter.addEventListener("change", applyFilters);
  }

  // Export functionality for combined directory
  const exportCSVBtn = $("exportCSV");
  const exportPDFBtn = $("exportPDF");

  if (exportCSVBtn) {
    exportCSVBtn.addEventListener("click", () => exportReportsToCSV());
  }

  if (exportPDFBtn) {
    exportPDFBtn.addEventListener("click", () => exportReportsToPDF());
  }
  
  // Make showEmployeeProfile globally available
  window.showEmployeeProfile = showEmployeeProfile;
  
  // Load data
  loadEmployees();
}