from core.responses import send_json, send_404
from services.profile_service import service_get_employee_profile

def get_employee_profile_controller(handler, employee_id):
    profile = service_get_employee_profile(employee_id)
    return send_json(handler, 200, profile) if profile else send_404(handler)