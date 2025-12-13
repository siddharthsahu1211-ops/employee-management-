# employee controller
# Add employee-related controller logic here
# Handlers are responsible for dealing with HTTP details (headers, body, methods)

import json
from core.responses import send_json, send_404
from core.request import parse_json_body
from services.employee_service import (
    service_get_all
    , service_get_one
    , service_create
    , service_update
    , service_delete
)

def get_all_employee(handler):
    return send_json(handler, 200, service_get_all())

def get_employee(handler, employee_id):
    employee = service_get_one(employee_id)
    return send_json(handler, 200, employee) if employee else send_404(handler)

def create_employee(handler):
    data = parse_json_body(handler)
    new_employee = service_create(data)
    return send_json(handler, 201, new_employee)

def update_employee(handler, employee_id):
    data = parse_json_body(handler)
    updated = service_update(employee_id, data)
    return send_json(handler, 200, updated) if updated else send_404(handler)

def delete_employee(handler, employee_id):
    deleted = service_delete(employee_id)
    return send_json(handler, 200, {"deleted": True}) if deleted else send_404(handler)