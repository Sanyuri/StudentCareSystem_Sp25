import os
from dotenv import load_dotenv
load_dotenv()

def get_async_tenant_list():
    tenants = {}
    for key, _ in os.environ.items():
        if key.endswith("_DB_URL"):
            tenant_key = key.replace("_DB_URL", "")
            db_url = os.environ.get(f"{tenant_key}_DB_URL", None)
            if db_url:
                tenants[tenant_key.lower()] = db_url
                
    return tenants

def get_all_tenant_names():
    tenants = get_async_tenant_list()
    return list(tenants.keys())