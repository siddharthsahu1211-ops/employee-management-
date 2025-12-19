from core.responses import send_json
from core.request import parse_json_body
from services.payroll_service import (
    get_all_payroll,
    create_payroll
)

def get_all_payroll_controller(handler):
    return send_json(handler, 200, get_all_payroll())

def create_payroll_controller(handler):
    data = parse_json_body(handler)
    return send_json(handler, 201, create_payroll(data))
