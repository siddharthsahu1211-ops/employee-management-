# tests/test_api_smoke.py

"""
API SMOKE TESTS FOR EMPLOYEE MANAGEMENT SYSTEM:

- Tests basic API endpoints to ensure they respond correctly
- Smoke tests verify that the system is running and accessible
- These are quick tests to catch major issues early
"""

import unittest
import os
import time
import subprocess
import urllib.request
import json


class TestApiSmoke(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Start the application server for testing"""
        cls.port = "8000"

        env = os.environ.copy()
        env["PORT"] = cls.port

        cls.proc = subprocess.Popen(
            ["python", "app.py"],
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )

        # Wait for server to start
        time.sleep(3)

    @classmethod
    def tearDownClass(cls):
        """Stop the application server after testing"""
        cls.proc.terminate()
        try:
            cls.proc.wait(timeout=3)
        except Exception:
            cls.proc.kill()

    def test_api_employees_returns_200(self):
        """
        Test that the employees API endpoint responds with HTTP 200
        """
        url = f"http://127.0.0.1:{self.port}/api/employees"

        with urllib.request.urlopen(url) as resp:
            self.assertEqual(resp.status, 200)
            body = resp.read().decode("utf-8")
            self.assertTrue(len(body) > 0)
            
            # Verify response is valid JSON
            try:
                json.loads(body)
            except json.JSONDecodeError:
                self.fail("API response is not valid JSON")

    def test_api_departments_returns_200(self):
        """
        Test that the departments API endpoint responds with HTTP 200
        """
        url = f"http://127.0.0.1:{self.port}/api/departments"

        with urllib.request.urlopen(url) as resp:
            self.assertEqual(resp.status, 200)
            body = resp.read().decode("utf-8")
            self.assertTrue(len(body) > 0)

    def test_api_payroll_returns_200(self):
        """
        Test that the payroll API endpoint responds with HTTP 200
        """
        url = f"http://127.0.0.1:{self.port}/api/payroll"

        with urllib.request.urlopen(url) as resp:
            self.assertEqual(resp.status, 200)
            body = resp.read().decode("utf-8")
            self.assertTrue(len(body) > 0)

    def test_api_complaints_returns_200(self):
        """
        Test that the complaints API endpoint responds with HTTP 200
        """
        url = f"http://127.0.0.1:{self.port}/api/complaints"

        with urllib.request.urlopen(url) as resp:
            self.assertEqual(resp.status, 200)
            body = resp.read().decode("utf-8")
            self.assertTrue(len(body) > 0)

    def test_frontend_home_page_loads(self):
        """
        Test that the main frontend page loads successfully
        """
        url = f"http://127.0.0.1:{self.port}/"

        with urllib.request.urlopen(url) as resp:
            self.assertEqual(resp.status, 200)
            body = resp.read().decode("utf-8")
            self.assertIn("Employee Management System", body)


if __name__ == '__main__':
    unittest.main()