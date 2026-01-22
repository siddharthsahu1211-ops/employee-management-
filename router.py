# router.py
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse
from core.static import serve_static
from core.responses import send_404
from core.middleware import add_cors_headers

from controllers.employee import (
    get_all_employee,
    get_employee,
    create_employee,
    update_employee,
    delete_employee
)

from controllers.complaint import (
    get_all_complaints_controller,
    get_complaint_controller,
    create_complaint_controller,
    update_complaint_controller,
    delete_complaint_controller
)

from controllers.payroll import (
    get_all_payroll_controller,
    create_payroll_controller,
    update_payroll_controller,
    delete_payroll_controller
)

from controllers.department import (
    handle_departments,
    handle_department_by_id
)

from controllers.profile import (
    get_employee_profile_controller
)

FRONTEND_ROUTES = {"/", "/home", "/employee", "/employees", "/complaints","/payroll", "/departments", "/reports", "/profile"}

def handle_ui_routes(handler, path):
    if path in FRONTEND_ROUTES:
        serve_static(handler, "frontend/pages/index.html")
        return True

    if path.startswith("/frontend/"):
        serve_static(handler, path.lstrip("/"))
        return True

    return False


class employeeRouter(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        add_cors_headers(self)
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path

        if handle_ui_routes(self, path):
            return

        # ✅ EMPLOYEE (singular + plural)
        if path in ("/api/employee", "/api/employees"):
            return get_all_employee(self)

        if path.startswith("/api/employee/") or path.startswith("/api/employees/"):
            employee_id = int(path.split("/")[-1])
            return get_employee(self, employee_id)

        # ✅ EMPLOYEE PROFILE
        if path.startswith("/api/profile/"):
            employee_id = int(path.split("/")[-1])
            return get_employee_profile_controller(self, employee_id)

        # ✅ COMPLAINTS
        if path == "/api/complaints":
            return get_all_complaints_controller(self)

        if path.startswith("/api/complaints/"):
            complaint_id = int(path.split("/")[-1])
            return get_complaint_controller(self, complaint_id)

        # ✅ PAYROLL
        if path == "/api/payroll":
            return get_all_payroll_controller(self)

        # ✅ DEPARTMENTS
        if path == "/api/departments":
            return handle_departments(self)

        return send_404(self)

    def do_POST(self):
        if self.path in ("/api/employee", "/api/employees"):
            return create_employee(self)

        if self.path == "/api/complaints":
            return create_complaint_controller(self)

        if self.path == "/api/payroll":
            return create_payroll_controller(self)

        if self.path == "/api/departments":
            return handle_departments(self)

        return send_404(self)

    def do_PUT(self):
        if self.path.startswith("/api/employee/") or self.path.startswith("/api/employees/"):
            employee_id = int(self.path.split("/")[-1])
            return update_employee(self, employee_id)

        if self.path.startswith("/api/complaints/"):
            complaint_id = int(self.path.split("/")[-1])
            return update_complaint_controller(self, complaint_id)
        if self.path.startswith("/api/payroll/"):
            payroll_id = int(self.path.split("/")[-1])
            return update_payroll_controller(self, payroll_id)

        if self.path.startswith("/api/departments/"):
            department_id = int(self.path.split("/")[-1])
            return handle_department_by_id(self, department_id)

        return send_404(self)

    def do_DELETE(self):
        if self.path.startswith("/api/employee/") or self.path.startswith("/api/employees/"):
            employee_id = int(self.path.split("/")[-1])
            return delete_employee(self, employee_id)

        if self.path.startswith("/api/complaints/"):
            complaint_id = int(self.path.split("/")[-1])
            return delete_complaint_controller(self, complaint_id)
        if self.path.startswith("/api/payroll/"):
            payroll_id = int(self.path.split("/")[-1])
            return delete_payroll_controller(self, payroll_id)

        if self.path.startswith("/api/departments/"):
            department_id = int(self.path.split("/")[-1])
            return handle_department_by_id(self, department_id)

        return send_404(self)