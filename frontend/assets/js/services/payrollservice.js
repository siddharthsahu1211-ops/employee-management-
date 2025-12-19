const API_URL = "/api/payroll";

export async function apiGetAll() {
  const res = await fetch(API_URL);
  return res.ok ? res.json() : [];
}

export function apiCreate(data) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}
