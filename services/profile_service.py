# services/profile_service.py
# Business logic for employee profile operations

from services.employee_service import service_get_one
from services.payroll_service import PayrollService
from services.complaint_service import ComplaintService

def service_get_employee_profile(employee_id):
    employee = service_get_one(employee_id)
    if not employee:
        return None
    
    payroll_service = PayrollService()
    complaint_service = ComplaintService()
    payroll_history = payroll_service.get_by_employee(employee_id)
    complaints = complaint_service.get_by_employee(employee_id)
    
    return {
        "employee": employee,
        "payroll_history": payroll_history,
        "complaints": complaints
    }