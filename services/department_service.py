# services/department_service.py
# Business logic for department operations

from database.queries import (
    db_get_all_departments,
    db_get_department,
    db_create_department,
    db_update_department,
    db_delete_department
)

class DepartmentService:
    def get_all(self):
        return db_get_all_departments()
    
    def create(self, data):
        return db_create_department(data)
    
    def update(self, department_id, data):
        return db_update_department(department_id, data)
    
    def delete(self, department_id):
        return db_delete_department(department_id)