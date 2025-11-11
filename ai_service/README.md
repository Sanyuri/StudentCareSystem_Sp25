# Student Risk Analysis Service

The Student Risk Analysis Service is an AI-powered component of the Student Care System designed to identify, analyze, and support at-risk students. It leverages machine learning models and natural language processing to provide student risk assessments and an intelligent chatbot for student assistance.

## Overview

This service implements several key features:

- **Student Risk Analysis**: Machine learning algorithms to identify at-risk students based on academic performance metrics
- **Intelligent Chatbot**: Context-aware conversational AI to assist students with questions about their academic journey
- **Multi-tenant Support**: Architecture designed to support multiple educational institutions with isolated data

## Architecture

The service follows a modular architecture:

- **API Layer**: FastAPI-based endpoints for service interaction
- **MCP (Model Control Protocol)**: Handles the structured communication between LLMs and tools
- **Core Services**: Business logic for student analysis and risk assessment
- **Machine Learning**: Models for student clustering and risk prediction
- **Database Layer**: MongoDB for data storage and Redis for caching/session management

## Technologies

- **Python 3.11**
- **FastAPI**: Web framework for building APIs
- **LangChain**: Framework for LLM applications
- **MongoDB**: Document database for storing student data
- **Redis**: In-memory data structure store for caching and session management
- **Scikit-learn**: Machine learning library for clustering algorithms
- **LLM Providers**: Support for multiple providers (Groq, Google Generative AI, Ollama)
- **ELK Stack**: Logging and monitoring
- **Docker Compose**: Deployment and integration with main StudentCareSystem

## Getting Started

### Prerequisites

- Python 3.9 or higher
- MongoDB instance
- Redis server
- LLM provider credentials (Groq API key, Google AI credentials, or Ollama)

### Installation

1. Clone the repository

```bash
git clone [repository-url]
cd StudentCareSystem_Sp25/ai-service
```

2. Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Set up environment variables by creating a `.env` file in the root directory:

```
# API Configuration
API_KEY=your_api_key
EXCLUDED_PATHS=["/__docs__", "/scalar"]

# Database Configuration
DB_URI=mongodb://localhost:27017
DB_NAME=SSRA_db
REDIS_URI=redis://localhost:6379

# LLM Configuration
MAX_TOKEN=3000
MAX_RETRIES=2
MAX_HISTORY_MESSAGES=10
MAX_MESSAGES_PER_DAY=10
BATCH_SIZE=1000

# Tenant Database URLs
TENANT1_DB_URL=mssql+aioodbc://user:password@localhost:5432/tenant1
```

### Running the Service

```bash
python -m app.main
```

The service will start at `http://localhost:8081` by default.

## API Endpoints

The service exposes the following API endpoints:

### Chat Controller

- `POST /chat/` - Submit a chat request to the AI chatbot
- `GET /chat/?user_id={user_id}` - Retrieve chat history for a specific user

### Student Analysis Controller

- Endpoints for analyzing student risk factors, retrieving student data, and generating insights

### Settings & Configuration

- Endpoints for managing LLM providers, model selection, and system settings

## Machine Learning Models

The service uses K-means clustering to group students based on risk factors:

- GPA gap
- Number of remaining failed subjects
- Attendance/absence rates

Models are stored in the `app/models` directory.

## Development

### Adding New Features

1. Create appropriate DTOs in `app/core/dtos`
2. Implement service logic in `app/core/services`
3. Create controller endpoints in `app/core/controllers`
4. Update MCP tools as needed in `app/mcp`

### Testing

```bash
pytest
```

## Troubleshooting

Common issues and their solutions:

- **Connection Issues**: Ensure MongoDB and Redis are running and properly configured
- **Missing Models**: Check the `app/models` directory for required ML model files
- **LLM Response Errors**: Verify API keys and provider settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with comprehensive description of changes

## License

[License details]
