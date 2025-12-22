import json
from core.middleware import add_cors_headers

def send_json(handler, status, data):
    handler.send_response(status)
    add_cors_headers(handler)
    handler.send_header("Content-Type", "application/json")
    handler.end_headers()
    handler.wfile.write(json.dumps(data).encode("utf-8"))


def send_404(handler):
    handler.send_response(404)
    add_cors_headers(handler)
    handler.send_header("Content-Type", "application/json")
    handler.end_headers()
    handler.wfile.write(json.dumps({
        "error": "Not Found"
    }).encode("utf-8"))


def send_400(handler, message="Bad Request"):
    handler.send_response(400)
    add_cors_headers(handler)
    handler.send_header("Content-Type", "application/json")
    handler.end_headers()
    handler.wfile.write(json.dumps({
        "error": message
    }).encode("utf-8"))
