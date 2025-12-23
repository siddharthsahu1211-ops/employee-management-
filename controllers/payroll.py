from core.responses import send_json, send_404
from core.request import parse_json_body
from services.payroll_service import (
    service_get_all,
    service_create,
    service_update,
    service_delete
)

def get_all_payroll_controller(handler):
    return send_json(handler, 200, service_get_all())

def create_payroll_controller(handler):
    data = parse_json_body(handler)
    new_id = service_create(data)
    return send_json(handler, 201, {"id": new_id})

def update_payroll_controller(handler, payroll_id):
    data = parse_json_body(handler)
    updated = service_update(payroll_id, data)
    return send_json(handler, 200, {"updated": True}) if updated else send_404(handler)

def delete_payroll_controller(handler, payroll_id):
    deleted = service_delete(payroll_id)
    return send_json(handler, 200, {"deleted": True}) if deleted else send_404(handler)
