# StudentCareSystem Backend  

## Overview  

StudentCareSystem is an enterprise-grade backend for educational institutions, implementing Clean Architecture and domain-driven design (DDD) on .NET 9.0. It integrates with:

- AI Service (FastAPI, Python) for risk analysis
- SQL Server for data
- Redis for caching
- ELK Stack for logging/monitoring
- Docker Compose for deployment

It supports multi-tenancy, robust authentication, and seamless integration with the frontend and AI modules.

## Architecture  

The project follows **Clean Architecture** principles with a strong focus on **domain-driven design**:  

- **Domain Layer**: Core business entities, interfaces, and business rules  
- **Application Layer**: Application-specific business rules and use cases  
- **Infrastructure Layer**: Implementation of interfaces defined in the domain layer  
- **API Layer**: RESTful API endpoints exposing system functionality  

## Tech Stack  

- **Framework**: .NET 9.0  
- **ORM**: Entity Framework Core  
- **Authentication**: JWT Token-based authentication  
- **Caching**: Redis  
- **Database**: SQL Server  
- **Multi-tenancy**: Finbuckle.MultiTenant  
- **Logging**: Serilog  
- **Testing**: NUnit, Moq, FluentAssertions  
- **Documentation**: Swagger/OpenAPI  
- **Monitoring**: Performance aspects using PostSharp  
- **External Communication**: Email service, Telegram bot integration  

## Key Features  

- **Multi-tenant architecture** supporting different educational institutions  
- **Student needs assessment** and care assignment  
- **Attendance tracking** and notification  
- **Academic performance monitoring** and analysis  
- **Student psychology and welfare tracking**  
- **Progress criteria tracking** for students requiring care  
- **Email communication** and notifications  
- **Activity logging** for audit trails  
- **Role-based access control**  
- **Integration with external academic systems (FAP)**  
- **AI-powered student risk assessment**  

## Project Structure  

```plaintext
StudentCareSystem/
├── StudentCareSystem.Domain/            # Entities, interfaces, business rules
├── StudentCareSystem.Application/       # Use cases, services, DTOs
├── StudentCareSystem.Infrastructure/    # Implementations, repositories, external services
├── StudentCareSystem.API/               # Controllers, middleware, configs
├── StudentCareSystem.Domain.Tests/      # Domain layer tests
├── StudentCareSystem.Application.Tests/ # Application layer tests
├── StudentCareSystem.Infrastructure.Tests/ # Infrastructure layer tests
└── StudentCareSystem.API.Tests/         # API layer tests
```

### **Key Components**  

#### **Domain Layer**  

- **Entities**: `Student`, `StudentNeedCare`, `StudentNote`, `StudentApplication`, `User`, etc.  
- **Interfaces**: Repository interfaces, service interfaces  
- **Constants**: Application constants and message descriptions  
- **Enums**: Various enum types like `ActivityType`, `RoleType`, `CareStatus`, etc.  

#### **Application Layer**  

- **Services**: Implementation of business logic and use cases  
- **DTOs**: Data transfer objects for incoming and outgoing data  
- **Mapping**: Object mapping configurations using AutoMapper  
- **Validators**: Input validation  
- **Exceptions**: Custom exception types  

#### **Infrastructure Layer**  

- **Data**: `DbContext`, entity configurations, migrations  
- **Repositories**: Data access implementations  
- **External Services**: Email service, FAP service, AI service  
- **Caching**: Redis caching implementation  
- **Specifications**: Query specifications pattern implementation  

#### **API Layer**  

- **Controllers**: RESTful API endpoints  
- **Middleware**: Authentication, exception handling, logging  
- **Configs**: Application configuration  
- **Attributes**: Custom authorization and validation attributes  

## Core Services  

### **Student Care Assignment**  

The system can automatically assign students who need care to appropriate staff members based on workload balancing, expertise, and other factors.  

### **Email Notifications**  

Automated email notifications for various events like attendance issues, application status changes, and critical care requirements.  

### **Student Need Care Analysis**  

AI-powered analysis to identify students who may need additional support based on various factors like academic performance, attendance, and psychology assessments.  

### **Note Management**  

Comprehensive note-taking system for recording student interactions, observations, and follow-ups.  

### **Progress Tracking**  

Tools to track student progress against defined criteria to ensure effective care and support.  

## Database  

The system uses a **rich relational database model** with entities including:  

- **Students** and their academic details  
- **Attendance records** and history  
- **Care assignments** and progress  
- **Email logs** and communication records  
- **User management** and permissions  
- **Psychological assessments** and notes  
- **Application tracking** for various student requests  

## Job Service (Hangfire)

The system utilizes **Hangfire** as a robust background processing and job scheduling framework with the following features:

### Job Types

- **Recurring Jobs**: Scheduled tasks that run on a defined CRON schedule
- **Background Jobs**: One-time tasks that can be triggered manually or programmatically
- **Continuation Jobs**: Tasks that execute when their parent jobs complete

### Multi-tenant Job Architecture

Each tenant has its own isolated set of jobs with:

- Tenant-specific scheduling
- Customizable execution time offsets
- Independent job history and state

### Implemented Jobs

| Job Type | Description | Default Schedule |
|----------|-------------|-----------------|
| ScanAttendance | Synchronizes student attendance data | 3x daily (7:00, 11:00, 16:00 UTC) |
| SemesterScan | Updates semester information | Daily (15:00 UTC) |
| SendAttendanceNotification | Sends attendance notifications | Daily (20:00 UTC) |
| ScanStudent | Updates student records | Daily (02:00 UTC) |
| ScanStudentDefer | Processes student deferrals | Daily (03:00 UTC) |
| ScanSubject | Updates subject information | Daily (02:00 UTC) |
| CheckEmailStatus | Verifies email delivery status | Hourly |
| ScanStudentSubject | Updates student-subject assignments | Daily (05:00 UTC) |
| ScanStudentPoint | Updates student academic points | Daily (06:00 UTC) |
| AnalyzeStudentNeedCare | Identifies students needing care | Daily (04:00 UTC) |
| ScanFailedJob | Monitors for job failures | Every 4 hours |
| SendEmailStatistics | Sends email statistics report | Daily (23:00 UTC) |

### Manual Job Execution

Administrators can trigger jobs on-demand through the API:

- Attendance scanning for specific semesters
- Sending attendance notifications for specific dates
- Scanning and processing deferrals
- Sending notifications for failed subjects

### Job Execution Strategy Pattern

The system employs a strategy pattern for job execution:

- Each job type implements `IJobExecutionStrategy`
- Job execution is tenant-aware and isolated
- Failed jobs are logged and can trigger notifications

### Hangfire Security

- Hangfire dashboard is secured with basic authentication
- Access credentials are configurable via `HangfireSetting`
- Dashboard access is restricted to authorized personnel

### Configuration

Hangfire is configured in `appsettings.json`:

```json
"Hangfire": {
  "Username": "admin",
  "Password": "securepassword",
  "ConnectionString": "Server=...;Database=Hangfire_DB;..."
}
```

### Monitoring

- Job status and history available through Hangfire dashboard
- Failed jobs trigger notifications to administrators
- Daily statistics reports summarize job execution metrics

## Setup and Development  

### **Prerequisites**  

- .NET 9.0 SDK  
- SQL Server  
- Redis Server  
- SMTP server for email functionality  

### **Configuration**  

1. Clone the repository  
2. Update connection strings in `appsettings.json`  
3. Configure tenant information in the database or configuration  
4. Set up SMTP and other external service credentials  

### **Development Environment Setup**

```bash
# Restore packages
dotnet restore

# Apply migrations
dotnet ef database update --project StudentCareSystem.Infrastructure --startup-project StudentCareSystem.API

# Run the application
dotnet run --project StudentCareSystem.API

# Create new migrations
dotnet ef migrations add <MigrationName> --project StudentCareSystem.Infrastructure --startup-project StudentCareSystem.API
```

## Testing  

The project includes comprehensive test coverage across all layers:  

```bash
# Run all tests
dotnet test

# Run specific test project
dotnet test StudentCareSystem.Application.Tests
```

## API Documentation  

API documentation is available via Swagger at `/swagger` when running the application in development mode.  

## Multi-tenancy  

The system supports **multiple tenants** (educational institutions) with **data isolation** and **customization options** for each tenant. Tenant information is stored in the database and accessed through the `AppTenantInfo` model.  

## Monitoring and Logging  

The application uses **Serilog** for structured logging and **custom performance aspects** to monitor critical operations. Logs are stored in files and can be configured to send to other sinks.

Additionally, the system implements an **ELK Stack** (Elasticsearch, Logstash, Kibana) for comprehensive logging and monitoring:

- **Elasticsearch**: For log storage and indexing
- **Kibana**: For log visualization and analysis
- **Filebeat**: For log shipping

This setup provides robust monitoring capabilities with real-time dashboards and alerting.

## Security  

The system implements a comprehensive security model to protect sensitive student and institutional data:

- **JWT token-based authentication** with refresh token capability
- **Permission-based authorization** with fine-grained access control:
  - Individual permissions can be assigned directly to users
  - Permissions can be grouped into roles for easier management
  - Combined approach allows for both role-based and direct permission assignments
  - Custom policy evaluation based on user's permissions
- **Password hashing and security** using ASP.NET Core Identity's PasswordHasher
- **Input validation and sanitization** at multiple layers
- **HTTPS enforcement** and secure communication
- **CSRF protection** through Anti-Forgery tokens and validation
- **Request checksum validation** to prevent tampering with API requests
- **Data Protection API** for secure key management and encryption
- **Secure key persistence** using Redis or filesystem with appropriate fallback mechanisms
- **Multi-factor authentication** support for administrative users
- **API rate limiting** to prevent abuse
- **Security headers** enforcement for all HTTP responses
- **Audit logging** of all security-relevant actions
- **Least privilege principle** applied throughout the application architecture

## Health Monitoring and Diagnostics

The system features comprehensive health monitoring capabilities:

- **Health checks** for all critical dependencies (database, Redis, external services)
- **Readiness and liveness probes** for container orchestration environments
- **Diagnostic endpoints** for system status monitoring
- **Performance monitoring** using custom aspects and middleware
- **Circuit breakers** for resilient external service communication
- **Dependency monitoring** with failure alerting
- **Integration with monitoring platforms** (Prometheus, Grafana)
- **Resource usage monitoring** (CPU, memory, connections)
- **Threshold-based alerts** for critical system metrics
- **Self-healing mechanisms** for common failure scenarios

## Resilience and High Availability

- **Retry policies** for transient failures
- **Circuit breaker patterns** for external service dependencies
- **Graceful degradation** when services are unavailable
- **Caching strategies** to reduce database load
- **Load balancing** support through stateless design
- **Horizontal scaling** capability for all components
- **Database connection pooling** and optimization
- **Asynchronous processing** of resource-intensive operations
- **Event-based architecture** for better system resilience
- **Distributed caching** with Redis

## Performance Optimization

- **Query optimization** through specification pattern
- **Efficient database access** with EF Core best practices
- **Response compression** for reduced bandwidth usage
- **Asynchronous programming model** throughout the codebase
- **Optimized entity tracking** in database operations
- **Pagination** for large data sets
- **Caching strategy** for frequently accessed data
- **Optimized serialization** for API responses
- **Background processing** for resource-intensive operations
- **Database indexing** strategy based on query patterns

## Deployment and DevOps

The system can be deployed in several ways:

### **Local Development**

Follow the setup instructions in the Development Environment Setup section.

### **Docker Deployment**

The entire system (Backend, Frontend, and AI Service) can be deployed using Docker Compose:

```bash
# From the project root
docker-compose up -d
```

Environment variables are stored in a `.env` file at the project root.

### **Health Check Endpoints**

The backend exposes health check endpoints for monitoring and diagnostics:

| Endpoint                                                               | Description                                 |
|------------------------------------------------------------------------|---------------------------------------------|
| `/b5f3e3ef-3f2e-4b2f-9a8e-16e0c0379ff2`                               | General health check (API, DB, Redis, etc.) |
| `/b5f3e3ef-3f2e-4b2f-9a8e-16e0c0379ff2/ready`                         | Readiness probe (for orchestrators)         |
| `/b5f3e3ef-3f2e-4b2f-9a8e-16e0c0379ff2/live`                          | Liveness probe (is API running)             |
| `/b5f3e3ef-3f2e-4b2f-9a8e-16e0c0379ff2/tenants`                       | Tenant-specific database health checks      |

All endpoints return a JSON health report compatible with HealthChecks UI and monitoring tools.

### **Production Deployment**

For production environments, consider:

- Using container orchestration (Kubernetes)
- Setting up proper CI/CD pipelines
- Implementing database migration strategies
- Configuring appropriate scaling policies

## Integration with Frontend and AI Services

The backend integrates with:

1. **Frontend** (React 18 with Vike SSR):
   - Communicates via RESTful APIs
   - Provides JWT authentication
   - Serves data for all UI components

2. **AI Service** (Python FastAPI):
   - Student risk analysis and prediction
   - Data processing pipelines
   - Machine learning models for student performance prediction
   - Recommendation engine for student care interventions 

## License  

[Specify the project license here]  

## Contributors  

[List of contributors to the project]  

## Acknowledgments  

[Any acknowledgments or third-party tools/libraries that deserve special mention]
