using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

using Finbuckle.MultiTenant.Abstractions;

using Microsoft.AspNetCore.WebUtilities;

using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Models.AIs;
using StudentCareSystem.Infrastructure.Models.Tenant;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Infrastructure.ExternalServices;

public class AIService(
    HttpClient httpClient,
    IMultiTenantContextAccessor<AppTenantInfo> multiTenantContextAccessor
) : IAIService
{
    private readonly string _tenantId = multiTenantContextAccessor.MultiTenantContext?.TenantInfo?.Identifier
        ?? throw new ArgumentNullException("TenantId");

    public async Task AnalyzeStudentNeedCareAsync(string SemesterName)
    {
        var baseUrl = "model/train-model";
        var payload = new
        {
            data = new { semester_name = SemesterName, n_clusters = 3 },
            timestamp = DateTime.UtcNow.ToString("o")
        };
        await SendHttpRequestAsync<object>(HttpMethod.Post, baseUrl, payload);
    }

    public async Task<Pagination<StudentResultItem>> GetStudentNeedCareAsync(StudentResultRequest studentResultRequest)
    {
        var baseUrl = "student-analysis/get-result";
        var payload = new
        {
            data = studentResultRequest,
            timestamp = DateTime.UtcNow.ToString("o")
        };
        var response = await SendHttpRequestAsync<ResponseObject<Pagination<StudentResultItem>>>(HttpMethod.Post, baseUrl, payload, null);
        return response?.Data ?? new Pagination<StudentResultItem>();
    }

    private async Task<T?> SendHttpRequestAsync<T>(HttpMethod method, string url, object? content = null, Dictionary<string, string?>? query = null)
    {
        if (query != null)
        {
            url = QueryHelpers.AddQueryString(url, query);
        }
        var request = new HttpRequestMessage(method, url);
        request.Headers.Add("tenant-name", _tenantId);
        if (content != null)
        {
            request.Content = new StringContent(JsonSerializer.Serialize(content, JsonSerializerSettings.SnakeCaseOptions), Encoding.UTF8, "application/json");
        }
        var response = await httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<T>(JsonSerializerSettings.SnakeCaseOptions);
    }
}
