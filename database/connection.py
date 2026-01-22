# database/connection.py
# Responsible ONLY for database connection & table creation

import sqlite3

DB_FILE = "employee.db"


def get_connection():
    """Return a SQLite connection with Row factory"""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def init_database():
    """Create required tables if they do not exist"""
    conn = get_connection()

    # Employee table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS employee (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            course TEXT,
            year TEXT,
            department_id INTEGER,
            created_at TEXT,
            updated_at TEXT,
            FOREIGN KEY (department_id) REFERENCES departments (id)
        )
    """)

    # Complaints table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS complaints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            employee_id INTEGER,
            created_at TEXT
        )
    """)
    
    # Add employee_id column to complaints table if it doesn't exist (migration)
    try:
        conn.execute("ALTER TABLE complaints ADD COLUMN employee_id INTEGER")
    except sqlite3.OperationalError:
        # Column already exists
        pass

    # Payroll table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS payroll (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER NOT NULL,
            salary REAL NOT NULL,
            month TEXT NOT NULL,
            created_at TEXT
        )
    """)

    # Departments table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            manager TEXT NOT NULL,
            budget REAL NOT NULL,
            location TEXT NOT NULL,
            description TEXT,
            created_at TEXT
        )
    """)

    conn.commit()
    conn.close()
    print("✅ Database initialized successfully")
