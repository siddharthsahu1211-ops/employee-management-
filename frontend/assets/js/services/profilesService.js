// frontend/assets/js/services/profilesService.js
// Fetch employee profile data from API

const API_URL = window.ENV?.API_BASE_URL || "/api";

export async function fetchAllEmployees() {
  try {
    const res = await fetch(`${API_URL}/employees`);
    return res.ok ? await res.json() : [];
  } catch (err) {
    console.error("[profilesService] fetchAllEmployees error:", err);
    return [];
  }
}

export async function fetchEmployeeById(id) {
  try {
    const res = await fetch(`${API_URL}/employees/${id}`);
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error("[profilesService] fetchEmployeeById error:", err);
    return null;
  }
}
