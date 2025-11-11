# Use multi-stage build for a smaller final image
FROM python:3.11-slim AS builder

# Set working directory
WORKDIR /app

# Install build dependencies for packages with C extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libc-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy only dependency files first for better caching
COPY pyproject.toml poetry.lock ./

# Configure Poetry and install runtime dependencies only
RUN poetry config virtualenvs.create false && \
    poetry install --without dev --no-interaction --no-root

# Second stage for the final image
FROM python:3.11-bookworm

# Set working directory
WORKDIR /app

# Install ODBC driver for SQL Server
RUN curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | tee /usr/share/keyrings/microsoft-archive-keyring.gpg > /dev/null

# Add Microsoft repository to install msodbcsql18
RUN echo "deb [signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" | tee /etc/apt/sources.list.d/mssql-release.list

# Install ODBC driver for SQL Server
RUN apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN adduser --disabled-password --gecos "" appuser

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Copy application code (adjust based on your structure)
COPY app/ ./app/

# Set Python environment variables for better runtime behavior
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH="/usr/local/lib/python3.11/site-packages:$PYTHONPATH"

# Set proper permissions
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
