import sqlite3
from database.connection import get_connection

def get_all_complaints():
    conn = get_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.execute("SELECT * FROM complaints")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_complaint(complaint_id):
    conn = get_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.execute(
        "SELECT * FROM complaints WHERE id = ?",
        (complaint_id,)
    )
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def create_complaint(data):
    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO complaints (title, description) VALUES (?, ?)",
        (data["title"], data["description"])
    )
    conn.commit()
    complaint_id = cursor.lastrowid
    conn.close()
    return get_complaint(complaint_id)

def update_complaint(complaint_id, data):
    conn = get_connection()
    conn.execute(
        "UPDATE complaints SET title = ?, description = ? WHERE id = ?",
        (data["title"], data["description"], complaint_id)
    )
    conn.commit()
    conn.close()
    return get_complaint(complaint_id)

def delete_complaint(complaint_id):
    conn = get_connection()
    conn.execute(
        "DELETE FROM complaints WHERE id = ?",
        (complaint_id,)
    )
    conn.commit()
    conn.close()
    return True
