# services/payroll_service.py
# Business logic for payroll operations

from database.queries import (
    db_get_all_payroll,
    db_get_payroll,
    db_get_payroll_by_employee,
    db_create_payroll,
    db_update_payroll,
    db_delete_payroll
)

class PayrollService:
    def get_all(self):
        return db_get_all_payroll()
    
    def get_by_employee(self, employee_id):
        return db_get_payroll_by_employee(employee_id)
    
    def create(self, data):
        return db_create_payroll(data)
    
    def update(self, payroll_id, data):
        return db_update_payroll(payroll_id, data)
    
    def delete(self, payroll_id):
        return db_delete_payroll(payroll_id)