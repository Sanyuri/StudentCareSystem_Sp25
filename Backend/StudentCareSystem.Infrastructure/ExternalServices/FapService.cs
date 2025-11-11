using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

using Finbuckle.MultiTenant.Abstractions;

using Microsoft.Extensions.Options;

using Newtonsoft.Json.Linq;

using Serilog;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Infrastructure.Aspects;
using StudentCareSystem.Infrastructure.Cachings;
using StudentCareSystem.Infrastructure.Models;
using StudentCareSystem.Infrastructure.Models.Attendances;
using StudentCareSystem.Infrastructure.Models.StudentLeaveApplications;
using StudentCareSystem.Infrastructure.Models.StudentPoints;
using StudentCareSystem.Infrastructure.Models.Students;
using StudentCareSystem.Infrastructure.Models.StudentSubjects;
using StudentCareSystem.Infrastructure.Models.Subjects;
using StudentCareSystem.Infrastructure.Models.Tenant;


namespace StudentCareSystem.Infrastructure.ExternalServices;

public class FapService(
    HttpClient httpClient,
    IRedisCacheService redisCacheService,
    IOptions<FapClientSetting> options,
    IMultiTenantContextAccessor<AppTenantInfo> tenantContextAccessor) : IFapService
{
    private readonly FapClientSetting _fapClientSetting = options.Value;
    private readonly FapAccount _fapAccount = tenantContextAccessor.MultiTenantContext?.TenantInfo?.FapAccount ??
        throw new ArgumentNullException(nameof(tenantContextAccessor));

    /// <summary>
    /// Gets the JWT token asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains the JWT token.</returns>
    /// <summary>
    /// Gets the JWT token asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains the JWT token.</returns>
    public async Task<string> GetJwtTokenAsync()
    {
        string? cacheToken;
        string cacheKey = $"{CacheKey.FapToken}_{_fapAccount.CampusCode}";

        // Try to get token from cache, continue if Redis fails
        try
        {
            cacheToken = await redisCacheService.GetTAsync<string>(cacheKey);
            if (!string.IsNullOrEmpty(cacheToken) && ValidateTokenExpiration(cacheToken))
            {
                return cacheToken;
            }
        }
        catch (Exception ex)
        {
            // Log the error but continue with the flow
            Log.Warning(ex, "Failed to retrieve token from Redis cache. Proceeding to get a new token.");
        }

        var loginRequest = new GetTokenRequest
        {
            Username = _fapAccount.Username,
            Password = _fapAccount.Password
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "Authentication/GetToken")
        {
            Content = new StringContent(JsonSerializer.Serialize(loginRequest), Encoding.UTF8, "application/json")
        };
        string checksum = GetCheckSum(null);
        request.Headers.Add("Checksum", checksum);
        request.Headers.Add("CampusCode", _fapAccount.CampusCode);
        var response = await httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync();
        var jsonResponse = JObject.Parse(responseContent);
        string newToken = jsonResponse["token"]?.ToString() ?? string.Empty;

        if (!string.IsNullOrEmpty(newToken))
        {
            try
            {
                var expiration = new JwtSecurityTokenHandler().ReadJwtToken(newToken).ValidTo;
                TimeSpan cacheDuration = expiration - DateTime.UtcNow - TimeSpan.FromMinutes(5); // 5 minutes buffer
                await redisCacheService.SetAsync(cacheKey, newToken, cacheDuration);
            }
            catch (Exception ex)
            {
                // Log the error but continue with the token
                Log.Warning(ex, "Failed to set token in Redis cache. Token will not be cached.");
            }
        }

        return newToken;
    }

    /// <summary>
    /// Gets the attendances asynchronously.
    /// </summary>
    /// <param name="startDate">The start date.</param>
    /// <param name="endDate">The end date.</param>
    /// <param name="pageSize">The size of the page.</param>
    /// <param name="pageNumber">The current page number.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a collection of attendance records.</returns>
    public async Task<IEnumerable<FapStudentAttendanceData>> GetAttendancesAsync(
        DateTime startDate,
        DateTime endDate,
        IEnumerable<string> rollNumbers)
    {
        var attendancesRequest = new
        {
            StartDate = startDate,
            EndDate = endDate,
            RollNumbers = rollNumbers
        };
        var response = await SendRequestAsync<IEnumerable<FapStudentAttendanceData>>(
            "Attendances/GetAttendanceByTime",
            HttpMethod.Post,
            attendancesRequest
        );
        return response ?? [];
    }

    /// <summary>
    /// Gets the semesters asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains a collection of semesters.</returns>
    /// <exception cref="HttpRequestException">Failed to send request to FAP API.</exception>
    public async Task<IEnumerable<Semester>> GetSemestersAsync()
    {
        var response = await SendRequestAsync<IEnumerable<Semester>>("Semesters/GetAllSemester", HttpMethod.Post);
        return response ?? [];
    }

    /// <summary>
    /// Gets the student detail asynchronously.
    /// </summary>
    /// <param name="rollNumber">The student roll number.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the student detail.</returns>
    /// <exception cref="HttpRequestException">Failed to send request to FAP API.</exception>
    public async Task<FapStudentDetail?> GetStudentDetailAsync(string rollNumber)
    {
        var response = await SendRequestAsync<FapStudentDetail>(
            $"User/GetStudentDetail/{rollNumber}",
            HttpMethod.Get
        );
        return response;
    }

    /// <summary>
    /// Gets the students asynchronously.
    /// </summary>
    /// <param name="pageSize">The size of the page.</param>
    /// <param name="currentPage">The current page number.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a collection of student data.</returns>
    public async Task<IEnumerable<FapStudentData>> GetStudentsAsync(int pageSize, int currentPage)
    {
        var studentRequest = new
        {
            PageSize = pageSize,
            CurrentPage = currentPage
        };
        var response = await SendRequestAsync<FapStudentResponse>(
            "User/GetStudents",
            HttpMethod.Post,
            studentRequest
        );
        return response?.Data ?? [];
    }

    /// <summary>
    /// Gets the total student records asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains the total number of student records.</returns>
    public async Task<int> GetTotalStudentRecordsAsync()
    {
        var studentRequest = new
        {
            IsOnlyCount = true
        };
        var response = await SendRequestAsync<FapStudentResponse>(
            "User/GetStudents",
            HttpMethod.Post,
            studentRequest
        );
        return response?.TotalRecords ?? 0;
    }

    /// <summary>
    /// Gets the leave applications asynchronously.
    /// </summary>
    /// <param name="startDate">The start date.</param>
    /// <param name="endDate">The end date.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a collection of leave application data.</returns>
    public async Task<IEnumerable<FapStudentDeferData>> GetStudentDefersAsync(DateTime startDate, DateTime endDate)
    {
        var StudentDeferRequest = new
        {
            StartDate = startDate,
            EndDate = endDate,
            RollNumbers = new List<string>()
        };
        var response = await SendRequestAsync<IEnumerable<FapStudentDeferData>>(
            "Defers/GetStudentDefer",
            HttpMethod.Post,
            StudentDeferRequest
        );
        return response ?? [];
    }


    /// <summary>
    /// Gets the FAP subjects asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains a collection of FAP subjects.</returns>
    public async Task<IEnumerable<FapSubjectData>> GetFapSubjectsAsync()
    {
        var response = await SendRequestAsync<IEnumerable<FapSubjectData>>(
            "Subject/GetSubjects",
            HttpMethod.Get
        );
        return response ?? [];
    }

    /// <summary>
    /// Gets the student points asynchronously.
    /// </summary>
    /// <param name="rollNumbers">The student roll numbers.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a collection of student points.</returns>
    [LoggingAspect]
    public async Task<IEnumerable<FapStudentPoint>> GetStudentPointsAsync(IEnumerable<string> rollNumbers)
    {
        var response = await SendRequestAsync<IEnumerable<FapStudentPoint>>(
            "StudentSubject/GetStudentEnrolledSubjectHasPoint",
            HttpMethod.Post,
            rollNumbers
        );
        return response ?? [];
    }

    /// <summary>
    /// Gets the student ssubjects asynchronously.
    /// </summary>
    /// <param name="rollNumbers">The student roll numbers.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a collection of student subjects.</returns>
    [LoggingAspect]
    public async Task<IEnumerable<FapStudentSubject>> GetStudentSubjectsAsync(IEnumerable<string> rollNumbers, DateTime? startDate = null, DateTime? endDate = null)
    {
        var bodyData = new
        {
            rollNumbers,
            startDate,
            endDate
        };
        var response = await SendRequestAsync<IEnumerable<FapStudentSubject>>(
            "StudentSubject/GetStudentEnrolledSubjectByDate",
            HttpMethod.Post,
            bodyData
        );
        return response ?? [];
    }

    /// <summary>
    /// Gets the checksum for the request.
    /// </summary>
    /// <param name="token">The token.</param>
    /// <returns>The checksum string.</returns>
    private string GetCheckSum(string? token)
    {
        string hashCode = _fapClientSetting.HashCode;
        string clientCode = _fapClientSetting.ClientCode;
        long timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        token ??= string.Empty;
        string message;
        if (string.IsNullOrEmpty(token))
        {
            message = $"{_fapAccount.Username}{_fapAccount.Password}SCS{timestamp}";
        }
        else
        {
            message = $"{token.Replace("Bearer ", "")}{clientCode}{timestamp}";
        }
        byte[] keyBytes = Encoding.UTF8.GetBytes(hashCode);
        byte[] messageBytes = Encoding.UTF8.GetBytes(message);

        using var hmac = new HMACSHA1(keyBytes);
        byte[] hashBytes = hmac.ComputeHash(messageBytes);

        string checksum = Convert.ToBase64String(hashBytes)
                            .Replace("=", "%3d")
                            .Replace(" ", "+");

        return $"{checksum}:{timestamp}";
    }

    /// <summary>
    /// Validates the JWT token expiration.
    /// </summary>
    /// <param name="token">The JWT token.</param>
    /// <returns><c>true</c> if the token is valid; otherwise, <c>false</c>.</returns>
    private static bool ValidateTokenExpiration(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            var jwtToken = tokenHandler.ReadJwtToken(token);
            var expiration = jwtToken.ValidTo;
            var buffer = 5; // 5 minutes
            return expiration.AddMinutes(-buffer) > DateTime.UtcNow;
        }
        catch
        {
            return false;
        }

    }

    /// <summary>
    /// Sends an HTTP request asynchronously.
    /// </summary>
    /// <typeparam name="TResponse">The type of the response.</typeparam>
    /// <param name="endpoint">The endpoint URL.</param>
    /// <param name="httpMethod">The HTTP method.</param>
    /// <param name="requestBody">The request body.</param>
    /// <param name="requiresAuthentication">if set to <c>true</c> [requires authentication].</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the response.</returns>
    /// <exception cref="HttpRequestException">Failed to send request to FAP API.</exception>
    private async Task<TResponse?> SendRequestAsync<TResponse>(
        string endpoint,
        HttpMethod httpMethod,
        object? requestBody = null,
        bool requiresAuthentication = true)
    {
        var request = new HttpRequestMessage(httpMethod, endpoint);

        if (requiresAuthentication)
        {
            var token = await GetJwtTokenAsync();
            request.Headers.Add("Authorization", $"Bearer {token}");
            request.Headers.Add("Checksum", GetCheckSum(token));
        }

        request.Headers.Add("CampusCode", _fapAccount.CampusCode);

        if (requestBody != null)
        {
            request.Content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8, "application/json");
        }
        try
        {
            var response = await httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<TResponse>();
        }
        catch (Exception ex)
        {
            throw new HttpRequestException($"Failed to send request to FAP API: {ex.Message}");
        }
    }


}

