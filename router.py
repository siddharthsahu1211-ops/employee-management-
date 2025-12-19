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

FRONTEND_ROUTES = {"/", "/home", "/employee", "/complaints"}

def handle_ui_routes(handler, path):
    """Serve SPA frontend pages"""
    if path in FRONTEND_ROUTES:
        # Serve the main SPA shell
        serve_static(handler, "frontend/pages/index.html")
        return True

    # Serve actual .html pages if needed
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

        # Serve SPA pages
        if handle_ui_routes(self, path):
            return

        # Employee API routes
        if path == "/api/employee":
            return get_all_employee(self)
        if path.startswith("/api/employee/"):
            employee_id = int(path.split("/")[-1])
            return get_employee(self, employee_id)

        # Complaints API routes
        if path == "/api/complaints":
            return get_all_complaints_controller(self)
        if path.startswith("/api/complaints/"):
            complaint_id = int(path.split("/")[-1])
            return get_complaint_controller(self, complaint_id)

        return send_404(self)

    def do_POST(self):
        if self.path == "/api/employee":
            return create_employee(self)
        if self.path == "/api/complaints":
            return create_complaint_controller(self)
        return send_404(self)

    def do_PUT(self):
        if self.path.startswith("/api/employee/"):
            employee_id = int(self.path.split("/")[-1])
            return update_employee(self, employee_id)
        if self.path.startswith("/api/complaints/"):
            complaint_id = int(self.path.split("/")[-1])
            return update_complaint_controller(self, complaint_id)
        return send_404(self)

    def do_DELETE(self):
        if self.path.startswith("/api/employee/"):
            employee_id = int(self.path.split("/")[-1])
            return delete_employee(self, employee_id)
        if self.path.startswith("/api/complaints/"):
            complaint_id = int(self.path.split("/")[-1])
            return delete_complaint_controller(self, complaint_id)
        return send_404(self)
