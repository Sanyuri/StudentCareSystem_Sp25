from app.core.session_manager import SessionManager
from sqlalchemy.orm import declarative_base
from app.core.async_session_manager import AsyncSessionManager

Base = declarative_base()

async def get_async_db_session(tenant_name=None):
    """
    Get a database session for the specified tenant.

    :param tenant_name: The tenant database to connect to.
    :return: SQLAlchemy session object.
    """
    return AsyncSessionManager(tenant_name)

def get_db_session(tenant_name=None):
    """
    Get a synchronous database session for the specified tenant.

    :param tenant_name: The tenant database to connect to.
    :return: SQLAlchemy session object.
    """
    return SessionManager(tenant_name)