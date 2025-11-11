namespace StudentCareSystem.Domain.Constants;

public static class MessageDescription
{
    /// <summary>
    /// RedisMessageDescription
    /// </summary>
    public static class RedisMessageDescription
    {
        public const string RedisConnectionFailed = "Failed to connect to Redis server. Using local file system for data protection keys.";
        public const string RedisConfigurationExceptionMessage = "Error occurred while configuring data protection.";
        public const string RedisConnectionExceptionMessage = "Failed to connect to Redis server.";
    }

    /// <summary>
    /// JwtMessageDescription
    /// </summary>
    public static class JwtMessageDescription
    {
        public const string IdentifierNotFound = "Cannot find identifier.";
        public const string TenantNotFound = "Cannot find tenant.";
        public const string AccessTokenNotValidForThisTenant = "Access token is not valid for this tenant.";
        public const string AccessTokenExpired = "Access token has expired.";
        public const string InvalidIssuer = "Token has an invalid issuer.";
        public const string InvalidAudience = "Token has an invalid audience.";
        public const string InvalidSignature = "Token has an invalid signature.";
        public const string InvalidCredentials = "Login failed. Please check your credentials and try again.";
    }

    /// <summary>
    /// DbContextMessageDescription
    /// </summary>
    public static class DbContextMessageDescription
    {
        public const string MigrateDatabaseForTenant = "Migrating database for tenant: {tenant}";
        public const string MigrateDatabaseForTenantSuccess = "Database migration for tenant: {tenant} is successful.";
        public const string NoPendingMigrationForTenant = "No pending migration for tenant: {tenant}";
        public const string MigrateDatabaseForTenantFailed = "Failed to migrate database for tenant: {tenant}";
        public const string DatabaseConnectionNotConfiguredProperly = "Database connection is not configured properly.";
    }

    /// <summary>
    /// ConnectionStringMessageDescription
    /// </summary>
    public static class ConnectionStringMessageDescription
    {
        public const string ConnectionStringNotConfiguredProperly = "Connection string is not configured properly.";
    }
    /// <summary>
    /// Api response message description
    /// </summary>
    public static class ApiResponseMessageDescription
    {
        public const string Success = "Success.";
        public const string Created = "Created.";
        public const string Updated = "Updated.";
        public const string Deleted = "Deleted.";
        public const string NotFound = "Not Found.";
        public const string BadRequest = "Bad Request.";
        public const string IdMismatch = "ID mismatch.";
    }

    /// <summary>
    /// ExceptionMessageDescription
    /// </summary>
    public static class ExceptionMessageDescription
    {
        public const string HeaderNotFound = "header is missing.";
        public const string TokenExpired = "token has expired.";
        public static string Invalid(string token) => $"Invalid {token}";
        public const string ForbiddenException = "You do not have permission to access this resource.";
        public static string EntityNotFound(string entity) => $"{entity} not found.";
        public static string EntityInUsed(string entity) => $"{entity} is in used.";
        public static string EntityAlreadyExists(string entity) => $"{entity} already exists.";
    }

}
