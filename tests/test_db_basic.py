# tests/test_db_basic.py

"""
DATABASE TESTS FOR EMPLOYEE MANAGEMENT SYSTEM:

These tests verify basic database functionality:
- Database connection works
- Required tables exist
- Basic data operations are possible

We are NOT testing business logic here.
We are only checking that the database is usable.
"""

import unittest
import sqlite3
import os
from database.connection import get_db_connection


class TestDatabaseBasics(unittest.TestCase):

    def test_database_connection(self):
        """
        Test that we can establish a database connection
        """
        try:
            conn = get_db_connection()
            self.assertIsNotNone(conn)
            conn.close()
        except Exception as e:
            self.fail(f"Failed to connect to database: {e}")

    def test_required_tables_exist(self):
        """
        Test that all required tables exist in the database
        """
        conn = get_db_connection()
        cur = conn.cursor()

        # Get all table names
        cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cur.fetchall()]
        conn.close()

        # Check that required tables exist
        required_tables = ['employees', 'departments', 'payroll', 'complaints']
        
        for table in required_tables:
            self.assertIn(
                table,
                tables,
                f"Required table '{table}' not found in database"
            )

    def test_employees_table_structure(self):
        """
        Test that the employees table has the expected columns
        """
        conn = get_db_connection()
        cur = conn.cursor()

        # Get column information for employees table
        cur.execute("PRAGMA table_info(employees);")
        columns = [row[1] for row in cur.fetchall()]
        conn.close()

        # Check for essential columns
        essential_columns = ['id', 'name', 'email']
        
        for column in essential_columns:
            self.assertIn(
                column,
                columns,
                f"Essential column '{column}' not found in employees table"
            )

    def test_basic_crud_operations(self):
        """
        Test basic Create, Read operations on employees table
        """
        conn = get_db_connection()
        cur = conn.cursor()

        try:
            # Test SELECT operation
            cur.execute("SELECT COUNT(*) FROM employees;")
            count = cur.fetchone()[0]
            self.assertIsInstance(count, int)

            # Test that we can query departments
            cur.execute("SELECT COUNT(*) FROM departments;")
            dept_count = cur.fetchone()[0]
            self.assertIsInstance(dept_count, int)

        except Exception as e:
            self.fail(f"Basic database operations failed: {e}")
        finally:
            conn.close()

    def test_payroll_table_exists_and_accessible(self):
        """
        Test that payroll table exists and is accessible
        """
        conn = get_db_connection()
        cur = conn.cursor()

        try:
            cur.execute("SELECT COUNT(*) FROM payroll;")
            count = cur.fetchone()[0]
            self.assertIsInstance(count, int)
        except Exception as e:
            self.fail(f"Payroll table access failed: {e}")
        finally:
            conn.close()

    def test_complaints_table_exists_and_accessible(self):
        """
        Test that complaints table exists and is accessible
        """
        conn = get_db_connection()
        cur = conn.cursor()

        try:
            cur.execute("SELECT COUNT(*) FROM complaints;")
            count = cur.fetchone()[0]
            self.assertIsInstance(count, int)
        except Exception as e:
            self.fail(f"Complaints table access failed: {e}")
        finally:
            conn.close()


if __name__ == '__main__':
    unittest.main()