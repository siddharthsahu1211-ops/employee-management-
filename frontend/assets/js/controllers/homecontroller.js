const $ = (id) => document.getElementById(id);

async function loadStats() {
  try {
    // Load all data in parallel
    const [employees, payroll, departments, complaints] = await Promise.all([
      fetch("/api/employee").then(r => r.ok ? r.json() : []),
      fetch("/api/payroll").then(r => r.ok ? r.json() : []),
      fetch("/api/departments").then(r => r.ok ? r.json() : []),
      fetch("/api/complaints").then(r => r.ok ? r.json() : [])
    ]);

    // Animate counters
    animateCounter("employeeCount", employees.length);
    animateCounter("payrollCount", payroll.length);
    animateCounter("departmentCount", departments.length);
    animateCounter("complaintCount", complaints.length);
  } catch (err) {
    console.error("Failed to load stats:", err);
  }
}

function animateCounter(elementId, targetValue) {
  const element = $(elementId);
  if (!element) return;
  
  let current = 0;
  const increment = targetValue / 30;
  const timer = setInterval(() => {
    current += increment;
    if (current >= targetValue) {
      current = targetValue;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 50);
}

export function initHomeController() {
  loadStats();
}