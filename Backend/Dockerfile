# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Set environment variables
ENV DOCKER_WORKDIR="/app"
ENV DOTNET_ENV="Release"

WORKDIR ${DOCKER_WORKDIR}

# Copy the project file and restore the dependencies
COPY . ./
RUN dotnet restore ./StudentCareSystem.API/StudentCareSystem.API.csproj

# Publish the application
RUN dotnet publish ./StudentCareSystem.API/StudentCareSystem.API.csproj -c ${DOTNET_ENV} -o out

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

# Set environment variables
ENV DOCKER_WORKDIR="/app"

WORKDIR ${DOCKER_WORKDIR}

# Ensure log directory exists and has proper permissions
RUN mkdir -p /app/Logs && chmod 755 /app/Logs

# Optionally create non-root user
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Optional: Create DataProtection keys directory
RUN mkdir -p /app/.aspnet/DataProtection-Keys && chown -R appuser:appgroup /app/.aspnet

# Copy the built application from the build stage
COPY --from=build ${DOCKER_WORKDIR}/out ./ 

# Expose the port your app is listening on
EXPOSE 8080

# Use non-root user to run the application
USER appuser

# Set the entrypoint for the container
ENTRYPOINT ["dotnet", "StudentCareSystem.API.dll"]
