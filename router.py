# Router configuration
# Add your route definitions here
# router.py

from datetime import datetime
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse

from controllers.employee import (
    get_all_employee,
    get_employee,
    create_employee,
    update_employee,
    delete_employee,
)

from core.static import serve_static
from core.responses import send_404
from core.middleware import add_cors_headers


# -------------------------------
# UI ROUTER (SPA shell + static)
# -------------------------------

FRONTEND_ROUTES = {"/", "/home", "/employee", "/docs"}

def handle_ui_routes(handler, path):
    if path in FRONTEND_ROUTES:
        serve_static(handler, "frontend/pages/index.html")
        return True

    if path.endswith(".html"):
        stripped = path.replace(".html", "")
        if stripped in FRONTEND_ROUTES:
            serve_static(handler, "frontend/pages/index.html")
            return True

    if path.startswith("/frontend/"):
        serve_static(handler, path.lstrip("/"))
        return True

    if path == "/openapi.yaml":
        serve_static(handler, "openapi.yaml")
        return True

    return False




# -------------------------------
# MAIN ROUTER CLASS
# -------------------------------

class employeeRouter(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        add_cors_headers(self)
        self.end_headers()


    # ---------------------------
    # READ (GET)
    # ---------------------------
    def do_GET(self):
        path = urlparse(self.path).path

        # 1. UI routes first (SPA)
        if handle_ui_routes(self, path):
            return



        # 2. API READ routes
        if path == "/api/employee":
            return get_all_employee(self)

        if path.startswith("/api/employee/"):
            employee_id = int(path.split("/")[-1])
            return get_employee(self, employee_id)

        return send_404(self)


    # ---------------------------
    # CREATE (POST)
    # ---------------------------
    def do_POST(self):
        if self.path == "/api/employee":
            return create_employee(self)
        return send_404(self)


    # ---------------------------
    # UPDATE (PUT)
    # ---------------------------
    def do_PUT(self):
        if self.path.startswith("/api/employee/"):
            employee_id = int(self.path.split("/")[-1])
            return update_employee(self, employee_id)
        return send_404(self)


    # ---------------------------
    # DELETE (DELETE)
    # ---------------------------
    def do_DELETE(self):
        if self.path.startswith("/api/employee/"):
            employee_id = int(self.path.split("/")[-1])
            return delete_employee(self, employee_id)
        return send_404(self)


    def log_message(self, format, *args):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [Server] {format % args}")
