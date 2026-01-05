const API_URL = "/api/payroll";

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function apiGetAll() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return [];
    return await safeJson(res) || [];
  } catch (err) {
    console.error('Error fetching payroll:', err);
    return [];
  }
}

export async function apiCreate(data) {
  try {
    return await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.error('Error creating payroll:', err);
    throw err;
  }
}

export async function apiUpdate(id, data) {
  try {
    return await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.error('Error updating payroll:', err);
    throw err;
  }
}

export async function apiDelete(id) {
  try {
    return await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });
  } catch (err) {
    console.error('Error deleting payroll:', err);
    throw err;
  }
}
