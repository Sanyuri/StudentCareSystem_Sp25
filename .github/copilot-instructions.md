# StudentCareSystem – Copilot Guide

## Architecture map
- Tri-service stack: `Backend/` (.NET 9 Clean Architecture), `Frontend/` (React 18 + Vike SSR), and Python AI (`ai_service/` risk engine, `ai_service_agent/` MCP gateway); orchestrated via `docker-compose*.yml`.
- Root `.env` feeds every container (API URLs, JWT, Redis, AI keys, Google OAuth). Verify values before local runs or tests.
- `EmailProxyMock/` emulates the external mail provider so backend email flows run locally without live SMTP.

## Backend (.NET)
- Clean layers live under `StudentCareSystem.{Domain|Application|Infrastructure|API}/`; keep domain rules in `Domain`, use AutoMapper DTOs in `Application`, and only reach persistence inside `Infrastructure`.
- Service/repository classes auto-register through `ApplicationConfigs.ConfigureAutoRegisterServices` and `InfrastructureConfigs.ConfigureAutoRegisterRepository`; name new classes `*Service` or `*Repository` to wire them in.
- Tenant context comes from Finbuckle; jobs/controllers expect `IMultiTenantContextAccessor<AppTenantInfo>` and outbound calls add a `tenant-name` header (see `Infrastructure/ExternalServices/AIService.cs`).
- Data access favors the specification pattern (`Infrastructure/Specifications`) plus pagination models under `Application/Commons`; reuse `SpecificationBuilder` instead of ad-hoc LINQ.
- Hangfire recurring jobs register in `Application/Services/Job/JobService.cs` using `IJobExecutionStrategy` implementations per scenario; extend that folder and update `RegisterJobs()` for new schedules.
- External HTTP clients (FAP, AI, email) share Polly retry/circuit policies via `API/Configs/HttpClientConfiguration.cs`; update the relevant `AISettings`/`EmailProxy` sections in `appsettings*.json` when touching integrations.
- Long-running imports depend on `BatchHelper.ProcessInBatchesAsync`; respect existing page sizes and log invalid data with Serilog.

## Frontend (React/Vike)
- SSR entrypoint is `Frontend/server/`; Express middlewares enforce CSP and proxy API calls—mirror changes server- and client-side.
- Client API calls go through `src/services/BaseService.ts` and `BaseAIService.ts` with axios-retry; always export typed helpers consumed by Zustand stores in `src/stores/`.
- Page routing follows Vike conventions: each folder under `src/pages` pairs a `.page.tsx` component with optional `+data.ts` loaders for TanStack Query prefetch.
- Global state lives in modular stores (`auth.store.ts`, etc.); mutations should trigger query invalidations rather than direct fetches.

## AI services (Python)
- `ai_service/app/` hosts the FastAPI risk engine; `main.py` applies API-key auth and multi-tenant DB selectors via async session managers—add new routes under `core/controllers` with DTOs in `core/dtos`.
- `ai_service_agent/app/` exposes MCP-driven chat tooling; reuse `core/services` strategies when adding LLM providers or prompt workflows.
- Both Python projects use Poetry; install with `poetry install` and run via `poetry run python -m app.main`. Tests execute with `poetry run pytest` (see `ai_service/tests/test_model_compability.py`).

## Developer workflows
- End-to-end stack: `docker-compose up` (development) or `docker-compose -f docker-compose-server.yml up` for infra-inclusive runs (SQL Server, Redis).
- Backend: `dotnet restore`, optional `dotnet ef database update --project StudentCareSystem.Infrastructure --startup-project StudentCareSystem.API`, then `dotnet run --project StudentCareSystem.API`; tests via `dotnet test`.
- Frontend: from `Frontend/`, `npm install`, `npm run dev`, tests with `npm run test:unit`.
- Keep Serilog and ELK configs in sync; backend logs flow to `Backend/Logs/` locally and to ELK when containers are up.
