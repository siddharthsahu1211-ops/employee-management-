# core/request.py
import json

class Request:
    def __init__(self, method, json_data):
        self.method = method
        self.json = json_data

def parse_request(handler):
    """Parse HTTP request into a Request object"""
    json_data = parse_json_body(handler)
    return Request(handler.command, json_data)

def parse_json_body(handler):
    """Read and decode JSON from HTTP request body safely."""
    try:
        length_header = handler.headers.get("Content-Length")
        length = int(length_header) if length_header else 0
        if length <= 0:
            return {}
        raw = handler.rfile.read(length)
        if not raw:
            return {}
        try:
            return json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            return {}
    except Exception:
        # Don't let parsing kill the request; return empty to let controllers validate
        return {}
