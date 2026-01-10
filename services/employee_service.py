# services/employee_service.py
# Business logic for employee operations

from database.queries import (
    db_get_all_employees,
    db_get_employee,
    db_create_employee,
    db_update_employee,
    db_delete_employee
)

def service_get_all():
    return db_get_all_employees()

def service_get_one(employee_id):
    return db_get_employee(employee_id)

def service_create(data):
    return db_create_employee(data)

def service_update(employee_id, data):
    return db_update_employee(employee_id, data)

def service_delete(employee_id):
    return db_delete_employee(employee_id)