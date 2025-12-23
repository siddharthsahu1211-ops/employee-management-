def init_database():
    conn = get_connection()

    # Employee table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS employee (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            course TEXT,
            year TEXT,
            created_at TEXT,
            updated_at TEXT
        )
    """)

    # Complaints table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS complaints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TEXT
        )
    """)
    # Payroll table
    
    conn.execute("""
        CREATE TABLE IF NOT EXISTS payroll (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER,
            salary REAL,
            month TEXT,
            created_at TEXT,
            FOREIGN KEY(employee_id) REFERENCES employee(id)
        )
    """)

    conn.commit()
    conn.close()
    print("✓ Database initialized")
