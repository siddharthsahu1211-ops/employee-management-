import { apiGetAll, apiGetOne, apiCreate, apiUpdate, apiDelete } from "../services/employeeservice.js";
import { showAlert } from "../components/alert.js";
import { renderEmployeeTable } from "../components/employeetable.js";
import { resetForm, fillForm } from "../components/employeeform.js";
import { setState, getState } from "../state/store.js";
import { $ } from "../utils/dom.js";

export function initEmployeeController() {
  loadEmployees();

  $("employeeForm").addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
      name: $("name").value.trim(),
      email: $("email").value.trim(),
      course: $("course").value.trim(),
      year: $("year").value.trim()
    };

    const { editingId } = getState();
    if (editingId) {
      await updateEmployee(editingId, data);
    } else {
      await createEmployee(data);
    }
  });

  $("cancelBtn").addEventListener("click", () => {
    setState({ editingId: null });
    resetForm();
  });
}

export async function loadEmployees() {
  const spinner = $("loadingSpinner");
  const table = $("employeeTableContainer");

  spinner.style.display = "block";
  table.style.display = "none";

  try {
    const employees = await apiGetAll();
    setState({ employees });
    renderEmployeeTable(employees);
  } catch (err) {
    console.error(err);
    showAlert("Failed to load employees", "error");
  } finally {
    spinner.style.display = "none";
    table.style.display = "block";
  }
}

export async function createEmployee(data) {
  const res = await apiCreate(data);
  if (res.ok) {
    showAlert("Employee added successfully");
    resetForm();
    loadEmployees();
  }
}

export async function editEmployee(id) {
  const employee = await apiGetOne(id);
  setState({ editingId: id });
  fillForm(employee);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function updateEmployee(id, data) {
  const res = await apiUpdate(id, data);
  if (res.ok) {
    showAlert("Employee updated successfully");
    resetForm();
    setState({ editingId: null });
    loadEmployees();
  }
}

export async function deleteEmployee(id) {
  if (!confirm("Delete this employee?")) return;
  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Employee deleted");
    loadEmployees();
  }
}
