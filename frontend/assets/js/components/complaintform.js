import { $ } from "../utils/dom.js";

export function resetForm() {
  $("complaintForm").reset();
  $("submitBtn").textContent = "Add Complaint";
  $("cancelBtn").style.display = "none";
}

export function fillForm(complaint) {
  $("title").value = complaint.title;
  $("description").value = complaint.description;
  $("submitBtn").textContent = "Update Complaint";
  $("cancelBtn").style.display = "inline-block";
}
