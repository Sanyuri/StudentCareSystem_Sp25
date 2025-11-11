# AI Service Agent

AI Service Agent is a flexible AI microservice built on top of the Model Context Protocol (MCP). It provides a standardized interface to interact with various Large Language Models (LLMs), enabling seamless model switching, structured message handling, and extendable tool integrations.

## Overview

This service supports advanced AI capabilities like retrieval, summarization, reasoning, and conversational AI through a unified, context-aware API layer. It's designed specifically to support student care systems with features for student data analysis and educational context-aware responses.

## Features

- **Multiple LLM Support**: Easily switch between different LLM providers (Groq, Google Generative AI, Ollama)
- **Conversational AI**: Stateful chat interface with conversation history management
- **Student Analysis**: Tools for analyzing student data and generating insights
- **Prompt Management**: Dynamic prompt templating and management system
- **Multi-tenant Support**: Built-in support for multi-tenant environments
- **Observability**: Integrated with monitoring and tracing tools

## Technology Stack

- **FastAPI**: High-performance web framework
- **LangChain & LangGraph**: Composable abstractions for LLM applications
- **MongoDB**: For persistent storage and session management
- **Redis**: For rate limiting and caching
- **Python 3.11+**: Modern Python features for async operations
- **Model Context Protocol (MCP)**: For standardized LLM interactions
- **Arize Phoenix**: For AI observability and monitoring

## Installation

> **Note:** This is a subproject of the main StudentCareSystem repository.  
> For general setup, architecture, and deployment instructions, please refer to the main [StudentCareSystem README](../README.md).

### Prerequisites

- Python 3.11 or higher
- MongoDB server
- Redis server
- (Optional) Docker & Docker Compose

### Setup (Local Development)

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

### Running with Docker

You can build and run the AI Service Agent using Docker:

```bash
# Build the Docker image
docker build -t ai-service-agent .

# Run the container (adjust environment variables and ports as needed)
docker run --env-file .env -p 8002:8002 ai-service-agent
```

- The service will be available at `http://localhost:8002`
- The default command runs: `uvicorn app.main:app --host 0.0.0.0 --port 8002`

## Configuration

Edit the `.env` file to configure the following:

Example configuration:

```bash
MAX_TOKEN=3000
MAX_RETRIES=2
MAX_HISTORY_MESSAGES=20
MAX_MESSAGES_PER_DAY=10

GOOGLE_API_KEY=
GROQ_API_KEY=

API_KEY=123123
EXCLUDED_PATHS='["/scalar","/docs","/openapi.json","/redoc", "/mcp/sse", "/mcp/messages/"]'

MONGODB_URI=mongodb://username:password@your-mongodb-host:port/
MONGODB_DB_NAME=

AI_SERVICE_AGENT_ENV=production
AI_SERVER_URL=http://ai-service:8000
```

### API Endpoints

- **Chat API**: `/chat` - Conversational interface with history
- **Student Analysis**: `/student-analysis` - Generate insights about students
- **Prompt Management**: `/prompt` - CRUD operations for AI prompts
- **Settings**: `/settings` - Configure LLM providers and models

## Documentation

API documentation is available at `/docs` or `/redoc` when the server is running.

## Architecture

The AI Service Agent is built with a modular architecture:

- **Controllers**: Handle API requests and responses
- **Services**: Business logic for different features
- **Core**: Session management and integrations with LLMs
- **Utils**: Shared utilities and helper functions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin new-feature`
5. Open a pull request

## License

[MIT License](LICENSE)

## Acknowledgments

- Model Context Protocol (MCP) for standardized LLM interaction
- LangChain & LangGraph for LLM composition frameworks
- FastAPI for the high-performance web framework
