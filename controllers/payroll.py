from core.responses import send_json, send_404
from core.request import parse_json_body
from services.payroll_service import PayrollService

def get_all_payroll_controller(handler):
    service = PayrollService()
    return send_json(handler, 200, service.get_all())

def create_payroll_controller(handler):
    service = PayrollService()
    data = parse_json_body(handler)
    new_record = service.create(data)
    return send_json(handler, 201, new_record)

def update_payroll_controller(handler, payroll_id):
    service = PayrollService()
    data = parse_json_body(handler)
    updated = service.update(payroll_id, data)
    return send_json(handler, 200, updated) if updated else send_404(handler)

def delete_payroll_controller(handler, payroll_id):
    service = PayrollService()
    deleted = service.delete(payroll_id)
    return send_json(handler, 200, deleted) if deleted else send_404(handler)
