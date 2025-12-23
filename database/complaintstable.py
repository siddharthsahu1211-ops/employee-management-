import sqlite3

# Connect to your database (employee.db)
conn = sqlite3.connect("employee.db")

# Create the complaints table
conn.execute('''
CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    employee_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT
)
''')

conn.commit()
conn.close()
print("Complaints table created successfully!")
