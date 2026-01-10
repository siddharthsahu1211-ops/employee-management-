# services/complaint_service.py
# Business logic for complaint operations

from database.queries import (
    db_get_all_complaints,
    db_get_complaint,
    db_create_complaint,
    db_update_complaint,
    db_delete_complaint
)

class ComplaintService:
    def get_all(self):
        return db_get_all_complaints()
    
    def get_by_id(self, complaint_id):
        return db_get_complaint(complaint_id)
    
    def create(self, data):
        return db_create_complaint(data)
    
    def update(self, complaint_id, data):
        return db_update_complaint(complaint_id, data)
    
    def delete(self, complaint_id):
        return db_delete_complaint(complaint_id)