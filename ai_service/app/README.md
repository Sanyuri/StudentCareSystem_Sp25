# StudentCareSystem AI Service – App Module

This module is the core application logic for the AI-powered Student Risk Analysis Service in StudentCareSystem. It exposes a FastAPI-based API for advanced student analytics, risk prediction, and model management, integrating with the main StudentCareSystem platform.

## 📦 Directory Structure

``` bash
app/
├── main.py                # FastAPI entrypoint, middleware, and API setup
├── core/
│   ├── controllers/       # API routers (MCP server, model, student analysis, exceptions)
│   ├── dtos/              # Data Transfer Objects (requests, responses, filters)
│   ├── services/          # Business logic (model, student, tenant, prompt, etc.)
│   ├── database.py        # Database connection utilities
│   ├── db_engine.py       # DB engine config
│   ├── async_session_manager.py # Async DB session manager
│   └── session_manager.py # Session management
├── models/                # Serialized ML models (KMeans, scaler, etc.)
├── utils/                 # Config, logging, HTTP client, audit
└── __init__.py
```

## 🚀 Features

- **REST API**: Modular FastAPI endpoints for:
  - Student risk analysis & clustering
  - Model inference and management
  - Student attendance, points, and ranking analytics
  - Multi-tenant support
- **ML Model Serving**: Loads and serves clustering (KMeans) and scaler models for student risk prediction.
- **Security**: API key protection on all endpoints (except whitelisted paths).
- **Multi-Tenancy**: Isolated configs and data per institution.
- **Configurable**: All settings via `.env` and environment variables (MongoDB, Redis, DB, ports, etc).
- **Exception Handling**: Custom handlers for HTTP, ValueError, and generic errors.
- **Docker-Ready**: Designed for deployment with Docker Compose and environment-based configuration.

## ⚙️ Configuration

Create a `.env` file at the project root with at least:

``` bash
# Redis Configuration
REDIS_URI=redis://localhost:6379

# MongoDB Configuration for AI service
MONGODB_URI=mongodb://username:password@your-mongodb-host:port/
MONGODB_DB_NAME=SSRA_db

# Tenant Databases
SCS_HN_DB_URL=mssql+aioodbc://sa:{password}:1433/scs_hn?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
SCS_HCM_DB_URL=mssql+aioodbc://sa:{password}:1433/scs_hcm?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
SCS_DN_DB_URL=mssql+aioodbc://sa:{password}:1433/scs_dn?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
SCS_CT_DB_URL=mssql+aioodbc://sa:{password}:1433/scs_ct?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
SCS_QN_DB_URL=mssql+aioodbc://sa:{password}:1433/scs_qn?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes

# SSRA Configuration
OFFSET=1000
BATCH_SIZE=1000

# API Key for AI service
API_KEY=your-strong-api-key
EXCLUDED_PATHS=["/scalar","/docs","/openapi.json","/redoc", "/mcp/sse", "/mcp/messages/"]


## 🏃‍♂️ Running the Service

### Development

```bash
# Configure Poetry to create virtual environments
poetry config virtualenvs.create true

# Install all dependencies from pyproject.toml
poetry install

# Activate the virtual environment (alternative to running with 'poetry run')
# poetry shell

# Run the development server
poetry run python -m app.main
```

### Production (Docker Compose)

This service is designed to run as part of the full StudentCareSystem stack via Docker Compose. Ensure all environment variables are set in your `.env` file.

## 🧩 Integration

- Serves as the AI backend for the StudentCareSystem platform
- Communicates with main backend and other services via REST APIs
- Multi-tenant support for different educational institutions
- Exposes endpoints for model management, student analytics, and administrative tasks

## 📝 API Overview

- `/student-analysis/` – Analyze student risk, attendance, and performance
- `/model/` – Model inference, retraining, and management
- `/mcp/` – Model Control Protocol for advanced AI workflows
- `/docs` and `/openapi.json` – Interactive API docs (excluded from API key protection)

## 🛡️ Security

- All endpoints require an API key via the `x-api-key` header (except excluded paths)
- Sensitive settings and credentials must be managed via environment variables

## 🧪 Testing & Extensibility

- Modular service and DTO structure for easy extension
- Add new analytics or models by extending `core/services` and `core/controllers`
- Comprehensive exception handling for robust operation
- **Running Tests**: Use pytest with Poetry to run the test suite:

```bash
poetry run pytest
```

## 🐍 Python Version

This service supports **Python 3.11** and above. Ensure you have the correct version installed before running the service.

## 📚 References

- FastAPI: <https://fastapi.tiangolo.com/>
- Uvicorn: <https://www.uvicorn.org/>
- Docker Compose: <https://docs.docker.com/compose/>

---

For detailed usage, see the main StudentCareSystem documentation and API docs (`/docs`).
