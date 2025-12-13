# Static file handling
# Add static file serving logic here
# core/static.py
import os
import mimetypes
from core.responses import send_404

# Fix JS MIME type for ES modules
mimetypes.add_type("application/javascript", ".js")

def serve_static(handler, filepath):
    # Normalize path
    full_path = os.path.join(".", filepath)

    # File doesn't exist
    if not os.path.exists(full_path):
        print("STATIC ERROR: File not found:", full_path)
        return send_404(handler)

    try:
        with open(full_path, "rb") as f:
            content = f.read()

        content_type, _ = mimetypes.guess_type(full_path)

        # Force-correct HTML + YAML types
        if full_path.endswith(".html"):
            content_type = "text/html"
        elif full_path.endswith(".yaml") or full_path.endswith(".yml"):
            content_type = "text/yaml"
        elif full_path.endswith(".js"):
            content_type = "application/javascript"

        handler.send_response(200)
        handler.send_header("Content-Type", content_type or "application/octet-stream")
        handler.end_headers()
        handler.wfile.write(content)

    except Exception as e:
        print("STATIC ERROR:", e)
        return send_404(handler)