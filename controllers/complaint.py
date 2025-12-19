from core.responses import send_json, send_404
from core.request import parse_json_body
from services.complaint_service import (
    get_all_complaints,
    get_complaint,
    create_complaint,
    update_complaint,
    delete_complaint
)

def get_all_complaints_controller(handler):
    return send_json(handler, 200, get_all_complaints())

def get_complaint_controller(handler, complaint_id):
    complaint = get_complaint(complaint_id)
    return send_json(handler, 200, complaint) if complaint else send_404(handler)

def create_complaint_controller(handler):
    data = parse_json_body(handler)
    complaint = create_complaint(data)
    return send_json(handler, 201, complaint)

def update_complaint_controller(handler, complaint_id):
    updated = update_complaint(complaint_id, parse_json_body(handler))
    return send_json(handler, 200, updated) if updated else send_404(handler)

def delete_complaint_controller(handler, complaint_id):
    delete_complaint(complaint_id)
    return send_json(handler, 200, {"deleted": True})
