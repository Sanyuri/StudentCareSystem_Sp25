from datetime import datetime


class AuditMixin:
    """Mixin to store audit information for MongoDB documents."""
    
    def generate_audit_fields(self, created_by=None, updated_by=None):
        return {
            "CreatedAt": datetime.now(),
            "CreatedBy": created_by,
            "UpdatedAt": datetime.now(),
            "UpdatedBy": updated_by,
            "DeletedAt": None,
            "DeletedBy": None
        }