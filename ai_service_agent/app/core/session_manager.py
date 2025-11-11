from app.core.db_engine import get_sync_db_engine
from sqlalchemy.orm import sessionmaker

class SessionManager:
    """Support for sync session management."""
    def __init__(self, tenant_name=None):
        self.tenant_name = tenant_name
        self.session = None
    
    def __enter__(self):
        engine = get_sync_db_engine(self.tenant_name)
        session_factory = sessionmaker(bind=engine, expire_on_commit=False)
        self.session = session_factory()
        return self.session
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            self.session.close()