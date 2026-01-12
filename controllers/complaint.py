from core.responses import send_json, send_404
from core.request import parse_json_body
from services.complaint_service import ComplaintService

def get_all_complaints_controller(handler):
    service = ComplaintService()
    return send_json(handler, 200, service.get_all())

def get_complaint_controller(handler, complaint_id):
    service = ComplaintService()
    complaint = service.get_by_id(complaint_id)
    return send_json(handler, 200, complaint) if complaint else send_404(handler)

def create_complaint_controller(handler):
    service = ComplaintService()
    data = parse_json_body(handler)
    return send_json(handler, 201, service.create(data))

def update_complaint_controller(handler, complaint_id):
    service = ComplaintService()
    data = parse_json_body(handler)
    updated = service.update(complaint_id, data)
    return send_json(handler, 200, updated) if updated else send_404(handler)

def delete_complaint_controller(handler, complaint_id):
    service = ComplaintService()
    deleted = service.delete(complaint_id)
    return send_json(handler, 200, deleted) if deleted else send_404(handler)
