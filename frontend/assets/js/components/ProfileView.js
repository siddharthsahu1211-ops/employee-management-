// frontend/assets/js/components/ProfileView.js
// Profile detail view components

import { $ } from "../utils/dom.js";

function show(id, yes) {
  const el = $(id);
  if (!el) return;
  el.classList[yes ? "remove" : "add"]("hidden");
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value ?? "—";
}

export function setProfileLoading(isLoading) {
  show("basicLoading", isLoading);
  show("basicDetails", !isLoading);
}

export function renderEmployeeBasic(employee) {
  setText("employeeId", employee?.id ?? "—");
  setText("employeeName", employee?.name ?? "—");
  setText("employeeEmail", employee?.email ?? "—");
  setText("employeeDepartment", employee?.department ?? "—");
  setText("employeePosition", employee?.position ?? "—");
  setText("employeeSalary", employee?.salary ? `$${Number(employee.salary).toLocaleString()}` : "—");
  setText("employeeJoinDate", employee?.joinDate ?? "—");
}

export function renderProfileError() {
  setProfileLoading(false);
}
