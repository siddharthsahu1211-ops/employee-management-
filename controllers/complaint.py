from core.responses import send_json, send_404
from core.request import parse_json_body
from services.complaint_service import (
    service_get_all,
    service_get_one,
    service_create,
    service_update,
    service_delete
)

def get_all_complaints_controller(handler):
    return send_json(handler, 200, service_get_all())

def get_complaint_controller(handler, complaint_id):
    complaint = service_get_one(complaint_id)
    return send_json(handler, 200, complaint) if complaint else send_404(handler)

def create_complaint_controller(handler):
    data = parse_json_body(handler)
    return send_json(handler, 201, service_create(data))

def update_complaint_controller(handler, complaint_id):
    data = parse_json_body(handler)
    updated = service_update(complaint_id, data)
    return send_json(handler, 200, updated) if updated else send_404(handler)

def delete_complaint_controller(handler, complaint_id):
    deleted = service_delete(complaint_id)
    return send_json(handler, 200, deleted) if deleted else send_404(handler)
