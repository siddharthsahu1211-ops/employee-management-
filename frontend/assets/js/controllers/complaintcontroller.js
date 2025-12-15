import { apiGetAll, apiGetOne, apiCreate, apiUpdate, apiDelete } from "../services/complaintservice.js";
import { showAlert } from "../components/alert.js";
import { renderComplaintTable } from "../components/complainttable.js";
import { resetForm, fillForm } from "../components/complaintform.js";
import { setState, getState } from "../state/store.js";
import { $ } from "../utils/dom.js";

/* ===============================
   INIT CONTROLLER
================================ */
export function initComplaintController() {
  loadComplaints();

  $("complaintForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      title: $("title").value.trim(),
      description: $("description").value.trim()
    };

    const { editingId } = getState();

    if (editingId) {
      await updateComplaint(editingId, data);
    } else {
      await createComplaint(data);
    }
  });

  $("cancelBtn").addEventListener("click", () => {
    setState({ editingId: null });
    resetForm();
  });
}

/* ===============================
   LOAD COMPLAINTS
================================ */
export async function loadComplaints() {
  const spinner = $("loadingSpinner");
  const table = $("complaintTableContainer");

  spinner.style.display = "block";
  table.style.display = "none";

  try {
    const complaints = await apiGetAll();
    setState({ complaints });
    renderComplaintTable(complaints);
  } catch (err) {
    console.error(err);
    showAlert("Failed to load complaints", "error");
  } finally {
    spinner.style.display = "none";
    table.style.display = "block";
  }
}

/* ===============================
   CREATE
================================ */
export async function createComplaint(data) {
  const res = await apiCreate(data);
  if (res.ok) {
    showAlert("Complaint added successfully");
    resetForm();
    loadComplaints();
  }
}

/* ===============================
   EDIT
================================ */
export async function editComplaint(id) {
  const complaint = await apiGetOne(id);
  setState({ editingId: id });
  fillForm(complaint);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ===============================
   UPDATE
================================ */
export async function updateComplaint(id, data) {
  const res = await apiUpdate(id, data);
  if (res.ok) {
    showAlert("Complaint updated successfully");
    resetForm();
    setState({ editingId: null });
    loadComplaints();
  }
}

/* ===============================
   DELETE
================================ */
export async function deleteComplaint(id) {
  if (!confirm("Delete this complaint?")) return;

  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Complaint deleted");
    loadComplaints();
  }
}
