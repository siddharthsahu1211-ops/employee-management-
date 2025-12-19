from database.connection import get_connection

def get_all_payroll():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM payroll").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def create_payroll(data):
    conn = get_connection()
    cur = conn.execute(
        "INSERT INTO payroll (employee_id, salary) VALUES (?, ?)",
        (data["employee_id"], data["salary"])
    )
    conn.commit()
    conn.close()
    return {"id": cur.lastrowid, **data}
