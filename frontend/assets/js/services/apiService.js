const API_URL = '/api/employee';

export async function fetchAllEmployees() {
  const res = await fetch(API_URL);
  return res.ok ? await res.json() : [];
}

export async function fetchEmployee(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.ok ? await res.json() : null;
}

export async function createEmployee(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.ok ? await res.json() : null;
}

export async function updateEmployee(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.ok ? await res.json() : null;
}

export async function deleteEmployee(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  return res.ok;
}

// Department API
export async function fetchAllDepartments() {
  const res = await fetch('/api/departments');
  return res.ok ? await res.json() : [];
}

// Payroll API
export async function fetchAllPayroll() {
  const res = await fetch('/api/payroll');
  return res.ok ? await res.json() : [];
}

// Complaints API
export async function fetchAllComplaints() {
  const res = await fetch('/api/complaints');
  return res.ok ? await res.json() : [];
}