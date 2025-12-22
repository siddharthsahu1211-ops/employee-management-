from database.queries import (
    db_get_all_complaints,
    db_get_one_complaint,
    db_create_complaint,
    db_update_complaint,
    db_delete_complaint
)

def service_get_all():
    return db_get_all_complaints()

def service_get_one(complaint_id):
    return db_get_one_complaint(complaint_id)

def service_create(data):
    return db_create_complaint(data)

def service_update(complaint_id, data):
    return db_update_complaint(complaint_id, data)

def service_delete(complaint_id):
    return db_delete_complaint(complaint_id)
