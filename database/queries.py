# Database queries
# Add database query functions here
# Actual SQL queries — Create, Read, Update, Delete (CRUD)

from datetime import datetime
from .connection import get_connection

def db_get_all():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM employee ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_get_one(employee_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM employee WHERE id = ?", (employee_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def db_create(data):
    conn = get_connection()
    now = datetime.now().isoformat()
    cur = conn.execute(
        "INSERT INTO employee (name, email, course, year, created_at) VALUES (?, ?, ?, ?, ?)",
        (data["name"], data["email"], data["course"], data["year"], now)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_one(new_id)

def db_update(employee_id, data):
    conn = get_connection()
    now = datetime.now().isoformat()
    conn.execute("""
        UPDATE employee SET name=?, email=?, course=?, year=?, updated_at=?
        WHERE id=?
    """, (data["name"], data["email"], data["course"], data["year"], now, employee_id))
    conn.commit()
    conn.close()
    return db_get_one(employee_id)

def db_delete(employee_id):
    employee = db_get_one(employee_id)
    if not employee:
        return None

    conn = get_connection()
    conn.execute("DELETE FROM employee WHERE id=?", (employee_id,))
    conn.commit()
    conn.close()
    return employee
# database/queries.py

# =========================
# COMPLAINT QUERIES
# =========================

# ===== COMPLAINT QUERIES =====

def db_get_all_complaints():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM complaints ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_get_one_complaint(complaint_id):
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM complaints WHERE id = ?",
        (complaint_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None

def db_create_complaint(data):
    conn = get_connection()
    cur = conn.execute(
        "INSERT INTO complaints (title, description) VALUES (?, ?)",
        (data["title"], data["description"])
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_one_complaint(new_id)

def db_update_complaint(complaint_id, data):
    conn = get_connection()
    conn.execute(
        "UPDATE complaints SET title=?, description=? WHERE id=?",
        (data["title"], data["description"], complaint_id)
    )
    conn.commit()
    conn.close()
    return db_get_one_complaint(complaint_id)

def db_delete_complaint(complaint_id):
    complaint = db_get_one_complaint(complaint_id)
    if not complaint:
        return None

    conn = get_connection()
    conn.execute("DELETE FROM complaints WHERE id=?", (complaint_id,))
    conn.commit()
    conn.close()
    return complaint
