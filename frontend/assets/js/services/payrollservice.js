const API_URL = window.ENV.API_BASE_URL_payroll;

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function getAllPayroll() {
  const res = await fetch(API_URL);
  if (!res.ok) return [];
  return safeJson(res);
}

export async function createPayroll(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return safeJson(res);
}

export async function updatePayroll(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return safeJson(res);
}

export async function deletePayroll(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return safeJson(res);
}
