# controllers/department.py
# Handles HTTP requests for departments

from core.responses import send_json, send_400
from services.department_service import DepartmentService
from datetime import datetime


def handle_departments(handler):
    """Route handler for /api/departments"""
    service = DepartmentService()
    
    if handler.command == "GET":
        departments = service.get_all()
        return send_json(handler, 200, departments)
    
    elif handler.command == "POST":
        from core.request import parse_json_body
        data = parse_json_body(handler)
        if not data or not all(k in data for k in ["name", "manager", "budget", "location"]):
            return send_400(handler, "Missing required fields")
        
        data["created_at"] = datetime.now().isoformat()
        department_id = service.create(data)
        return send_json(handler, 201, {"id": department_id, "message": "Department created"})
    
    return send_400(handler, "Method not allowed")


def handle_department_by_id(handler, department_id):
    """Route handler for /api/departments/{id}"""
    service = DepartmentService()
    
    if handler.command == "PUT":
        from core.request import parse_json_body
        data = parse_json_body(handler)
        if not data:
            return send_400(handler, "No data provided")
        
        success = service.update(department_id, data)
        if success:
            return send_json(handler, 200, {"message": "Department updated"})
        return send_400(handler, "Department not found")
    
    elif handler.command == "DELETE":
        success = service.delete(department_id)
        if success:
            return send_json(handler, 200, {"message": "Department deleted"})
        return send_400(handler, "Department not found")
    
    return send_400(handler, "Method not allowed")