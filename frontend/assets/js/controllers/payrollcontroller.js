import {
  apiGetAll,
  apiGetOne,
  apiCreate,
  apiUpdate,
  apiDelete
} from "../services/payrollservice.js";

import { showAlert } from "../components/alert.js";
import { renderPayrollTable } from "../components/payrolltable.js";
import { resetPayrollForm, fillPayrollForm } from "../components/payrollform.js";
import { setState, getState } from "../state/store.js";
import { $ } from "../utils/dom.js";

/* ---------------- INIT ---------------- */

export function initPayrollController() {
  loadPayrolls();

  $("payrollForm").addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
      employee_name: $("employee_name").value.trim(),
      salary: $("salary").value.trim(),
      month: $("month").value.trim()
    };

    const { editingId } = getState();

    if (editingId) {
      await updatePayroll(editingId, data);
    } else {
      await createPayroll(data);
    }
  });

  $("cancelPayrollBtn").addEventListener("click", () => {
    setState({ editingId: null });
    resetPayrollForm();
  });
}

/* ---------------- LOAD ---------------- */

export async function loadPayrolls() {
  const spinner = $("loadingSpinner");
  const table = $("payrollTableContainer");

  spinner.style.display = "block";
  table.style.display = "none";

  try {
    const payrolls = await apiGetAll();
    setState({ payrolls });
    renderPayrollTable(payrolls);
  } catch (err) {
    console.error(err);
    showAlert("Failed to load payroll data", "error");
  } finally {
    spinner.style.display = "none";
    table.style.display = "block";
  }
}

/* ---------------- CREATE ---------------- */

export async function createPayroll(data) {
  const res = await apiCreate(data);
  if (res.ok) {
    showAlert("Payroll added successfully");
    resetPayrollForm();
    loadPayrolls();
  }
}

/* ---------------- EDIT ---------------- */

export async function editPayroll(id) {
  const payroll = await apiGetOne(id);
  if (!payroll) return;

  setState({ editingId: id });
  fillPayrollForm(payroll);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------------- UPDATE ---------------- */

export async function updatePayroll(id, data) {
  const res = await apiUpdate(id, data);
  if (res.ok) {
    showAlert("Payroll updated successfully");
    resetPayrollForm();
    setState({ editingId: null });
    loadPayrolls();
  }
}

/* ---------------- DELETE ---------------- */

export async function deletePayroll(id) {
  if (!confirm("Delete this payroll record?")) return;

  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Payroll deleted");
    loadPayrolls();
  }
}
