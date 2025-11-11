from dotenv import load_dotenv
import os

from app.core.services.tenant_service import get_async_tenant_list

# Load .env file
load_dotenv()

AI_SERVICE_ENV = os.getenv("AI_SERVICE_ENV", "production")

# ========================
# 🔧 External Service Configs
# ========================

# Redis config
REDIS_URI = os.getenv("REDIS_URI", "redis://localhost:6379")

# SSRA main database (e.g., PostgreSQL/MySQL)
SSRA_DB_URL = os.getenv("SSRA_DB_URL")

# MongoDB config
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "SSRA_db")

# ========================
# 🏢 Tenant Configs
# ========================

ASYNC_TENANT_DB_CONFIGS = get_async_tenant_list()

# ========================
# ⚙️ Application Settings
# ========================

BATCH_SIZE = int(os.getenv("BATCH_SIZE", 1000))
MAX_TOKEN = int(os.getenv("MAX_TOKEN", 3000))
MAX_RETRIES = int(os.getenv("MAX_RETRIES", 2))
MAX_HISTORY_MESSAGES = int(os.getenv("MAX_HISTORY_MESSAGES", 10))
MAX_MESSAGES_PER_DAY = int(os.getenv("MAX_MESSAGES_PER_DAY", 10))

PHOENIX_COLLECTOR_ENDPOINT = os.getenv("PHOENIX_COLLECTOR_ENDPOINT", "http://localhost:8083")

AI_SERVICE_PORT = int(os.getenv("AI_SERVICE_PORT", 8000))