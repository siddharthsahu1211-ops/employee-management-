# database/queries.py
# Comprehensive SQL queries for Employee Management System
# All CRUD operations organized by entity

from datetime import datetime
from .connection import get_connection

# =========================
# EMPLOYEE QUERIES
# =========================

def db_get_all_employees():
    conn = get_connection()
    query = """
    SELECT e.*, d.name as department_name
    FROM employee e
    LEFT JOIN departments d ON e.department_id = d.id
    ORDER BY e.id DESC
    """
    rows = conn.execute(query).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_get_employee(employee_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM employee WHERE id = ?", (employee_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def db_create_employee(data):
    conn = get_connection()
    now = datetime.now().isoformat()
    cur = conn.execute(
        "INSERT INTO employee (name, email, year, department_id, created_at) VALUES (?, ?, ?, ?, ?)",
        (data["name"], data["email"], data["year"], data.get("department_id"), now)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_employee(new_id)

def db_update_employee(employee_id, data):
    conn = get_connection()
    now = datetime.now().isoformat()
    conn.execute("""
        UPDATE employee SET name=?, email=?, year=?, department_id=?, updated_at=?
        WHERE id=?
    """, (data["name"], data["email"], data["year"], data.get("department_id"), now, employee_id))
    conn.commit()
    conn.close()
    return db_get_employee(employee_id)

def db_delete_employee(employee_id):
    employee = db_get_employee(employee_id)
    if not employee:
        return None
    conn = get_connection()
    conn.execute("DELETE FROM employee WHERE id=?", (employee_id,))
    conn.commit()
    conn.close()
    return employee

# =========================
# DEPARTMENT QUERIES
# =========================

def db_get_all_departments():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM departments ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_get_department(department_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM departments WHERE id = ?", (department_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def db_create_department(data):
    conn = get_connection()
    now = datetime.now().isoformat()
    cur = conn.execute(
        "INSERT INTO departments (name, manager, budget, location, description, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (data["name"], data["manager"], data["budget"], data["location"], data.get("description", ""), now)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_department(new_id)

def db_update_department(department_id, data):
    conn = get_connection()
    conn.execute("""
        UPDATE departments SET name=?, manager=?, budget=?, location=?, description=?
        WHERE id=?
    """, (data["name"], data["manager"], data["budget"], data["location"], data.get("description", ""), department_id))
    conn.commit()
    conn.close()
    return db_get_department(department_id)

def db_delete_department(department_id):
    department = db_get_department(department_id)
    if not department:
        return None
    conn = get_connection()
    conn.execute("DELETE FROM departments WHERE id=?", (department_id,))
    conn.commit()
    conn.close()
    return department

# =========================
# PAYROLL QUERIES
# =========================

def db_get_all_payroll():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM payroll ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_get_payroll(payroll_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM payroll WHERE id = ?", (payroll_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def db_create_payroll(data):
    conn = get_connection()
    now = datetime.now().isoformat()
    cur = conn.execute(
        "INSERT INTO payroll (employee_id, salary, month, created_at) VALUES (?, ?, ?, ?)",
        (data["employee_id"], data["salary"], data["month"], now)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_payroll(new_id)

def db_update_payroll(payroll_id, data):
    conn = get_connection()
    conn.execute("""
        UPDATE payroll SET employee_id=?, salary=?, month=?
        WHERE id=?
    """, (data["employee_id"], data["salary"], data["month"], payroll_id))
    conn.commit()
    conn.close()
    return db_get_payroll(payroll_id)

def db_delete_payroll(payroll_id):
    payroll = db_get_payroll(payroll_id)
    if not payroll:
        return None
    conn = get_connection()
    conn.execute("DELETE FROM payroll WHERE id=?", (payroll_id,))
    conn.commit()
    conn.close()
    return payroll

# =========================
# COMPLAINT QUERIES
# =========================

def db_get_all_complaints():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM complaints ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_get_complaint(complaint_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM complaints WHERE id = ?", (complaint_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def db_create_complaint(data):
    conn = get_connection()
    now = datetime.now().isoformat()
    cur = conn.execute(
        "INSERT INTO complaints (title, description, created_at) VALUES (?, ?, ?)",
        (data["title"], data["description"], now)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_complaint(new_id)

def db_update_complaint(complaint_id, data):
    conn = get_connection()
    conn.execute("""
        UPDATE complaints SET title=?, description=?
        WHERE id=?
    """, (data["title"], data["description"], complaint_id))
    conn.commit()
    conn.close()
    return db_get_complaint(complaint_id)

def db_delete_complaint(complaint_id):
    complaint = db_get_complaint(complaint_id)
    if not complaint:
        return None
    conn = get_connection()
    conn.execute("DELETE FROM complaints WHERE id=?", (complaint_id,))
    conn.commit()
    conn.close()
    return complaint

# =========================
# ADVANCED QUERIES (JOINS)
# =========================

def db_get_employee_payroll_report():
    """Get joined employee and payroll data for reports"""
    conn = get_connection()
    query = """
    SELECT 
        e.id as employee_id,
        e.name,
        e.email,
        e.year,
        d.name as department_name,
        p.salary,
        p.month,
        p.id as payroll_id
    FROM payroll p
    LEFT JOIN employee e ON p.employee_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    ORDER BY p.id DESC
    """
    rows = conn.execute(query).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_get_department_employees(department_id):
    """Get all employees in a specific department"""
    conn = get_connection()
    query = """
    SELECT e.*, d.name as department_name
    FROM employee e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.department_id = ?
    ORDER BY e.name
    """
    rows = conn.execute(query, (department_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_get_payroll_summary():
    """Get payroll summary statistics"""
    conn = get_connection()
    query = """
    SELECT 
        COUNT(*) as total_records,
        SUM(salary) as total_payroll,
        AVG(salary) as average_salary,
        MIN(salary) as min_salary,
        MAX(salary) as max_salary,
        COUNT(DISTINCT employee_id) as unique_employees,
        COUNT(DISTINCT month) as active_months
    FROM payroll
    """
    row = conn.execute(query).fetchone()
    conn.close()
    return dict(row) if row else None

def db_search_employees(search_term):
    """Search employees by name or email"""
    conn = get_connection()
    query = """
    SELECT e.*, d.name as department_name
    FROM employee e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.name LIKE ? OR e.email LIKE ?
    ORDER BY e.name
    """
    search_pattern = f"%{search_term}%"
    rows = conn.execute(query, (search_pattern, search_pattern)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

# =========================
# UTILITY QUERIES
# =========================

def db_get_table_counts():
    """Get record counts for all tables"""
    conn = get_connection()
    counts = {}
    
    tables = ['employee', 'departments', 'payroll', 'complaints']
    for table in tables:
        row = conn.execute(f"SELECT COUNT(*) as count FROM {table}").fetchone()
        counts[table] = row['count'] if row else 0
    
    conn.close()
    return counts

def db_cleanup_orphaned_records():
    """Remove payroll records for non-existent employees"""
    conn = get_connection()
    conn.execute("""
        DELETE FROM payroll 
        WHERE employee_id NOT IN (SELECT id FROM employee)
    """)
    conn.commit()
    conn.close()
    return True