# Static file handling
# Add static file serving logic here
# core/static.py
import os
import mimetypes
from core.responses import send_404
from core.middleware import add_cors_headers

# Fix MIME types for web assets
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")

def serve_static(handler, filepath):
    # Normalize path
    full_path = os.path.join(".", filepath)

    # File doesn't exist
    if not os.path.exists(full_path):
        return send_404(handler)

    try:
        with open(full_path, "rb") as f:
            content = f.read()

        # Force-correct MIME types
        if full_path.endswith(".css"):
            content_type = "text/css; charset=utf-8"
        elif full_path.endswith(".js"):
            content_type = "application/javascript; charset=utf-8"
        elif full_path.endswith(".html"):
            content_type = "text/html; charset=utf-8"
        else:
            content_type, _ = mimetypes.guess_type(full_path)
            content_type = content_type or "application/octet-stream"

        handler.send_response(200)
        handler.send_header("Content-Type", content_type)
        handler.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        add_cors_headers(handler)
        handler.end_headers()
        handler.wfile.write(content)
        return

    except Exception as e:
        return send_404(handler)