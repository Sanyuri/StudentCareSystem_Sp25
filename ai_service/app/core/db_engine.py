from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine
from app.utils.config import ASYNC_TENANT_DB_CONFIGS

async_engines = {}
sync_engines = {}

def create_async_db_engine(db_url):
    """Create SQLAlchemy engine for a given database URL."""
    return create_async_engine(db_url, echo=False, future=True)

def get_async_db_engine(tenant_name = None):
    """
    Get or create an engine for the specified tenant.

    :param tenant_name: The tenant database to connect to.
    :return: SQLAlchemy engine object.
    """

    db_url = ASYNC_TENANT_DB_CONFIGS.get(tenant_name)

    if not db_url:
        raise ValueError(f"Invalid tenant name: {tenant_name}")

    if tenant_name not in async_engines:
        async_engines[tenant_name] = create_async_db_engine(db_url)

    return async_engines[tenant_name]

def create_sync_db_engine(db_url):
    """Create SQLAlchemy synchronous engine for a given database URL."""
    return create_engine(db_url, echo=False, future=True)

def get_sync_db_engine(tenant_name=None):
    """
    Get or create a synchronous engine for the specified tenant.

    :param tenant_name: The tenant database to connect to.
    :return: SQLAlchemy engine object.
    """

    db_url = ASYNC_TENANT_DB_CONFIGS.get(tenant_name)

    if not db_url:
        raise ValueError(f"Invalid tenant name: {tenant_name}")

    if tenant_name not in sync_engines:
        # replace aioodbc to pyodbc for sync engine
        db_url = db_url.replace("aioodbc", "pyodbc")
        sync_engines[tenant_name] = create_sync_db_engine(db_url)

    return sync_engines[tenant_name]