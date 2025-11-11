using System.Globalization;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

using Finbuckle.MultiTenant.Abstractions;

using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;

using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Aspects;
using StudentCareSystem.Infrastructure.Models.EmailProxies;
using StudentCareSystem.Infrastructure.Models.Tenant;
using StudentCareSystem.Infrastructure.Utilities;


namespace StudentCareSystem.Infrastructure.ExternalServices;

public class EmailProxyService(HttpClient httpClient,
    IMultiTenantContextAccessor<AppTenantInfo> multiTenantContextAccessor,
    IOptions<EmailProxySetting> emailProxySetting
) : IEmailProxyService
{

    private readonly AppTenantInfo? _tenantInfo = multiTenantContextAccessor.MultiTenantContext?.TenantInfo;
    private readonly EmailProxySetting _emailProxySetting = emailProxySetting.Value;

    [LoggingAspect]
    public async Task SendEmailAsync(
        string subject,
        string content,
        List<string> recipientEmails,
        List<string> ccEmails,
        List<string> bccEmails,
        string replyToEmail,
        EmailLog emailLog
    )
    {
        var emailRequest = new SendEmailRequest
        {
            IsRaw = true,
            Content = content,
            Data = { ["content"] = content },
            Subject = subject,
            Receiver = recipientEmails,
            CampusCode = _tenantInfo?.FapAccount.CampusCode ?? string.Empty,
            Project = Information.ProjectName,
            Keys = _emailProxySetting.Key,
            IdentifierCode = Guid.NewGuid(),
            Bcc = ccEmails,
            Cc = bccEmails,
            ReplyToAddress = !string.IsNullOrEmpty(replyToEmail) ? replyToEmail : null
        };
        emailLog.Subject = subject;
        emailLog.Content = content;
        emailLog.RecipientEmail = StringListConverter.ConvertListToString(recipientEmails);
        emailLog.CcEmails = StringListConverter.ConvertListToString(ccEmails);
        emailLog.BccEmails = StringListConverter.ConvertListToString(bccEmails);
        emailLog.ReplyToEmail = replyToEmail;
        emailLog.IdentifierCode = emailRequest.IdentifierCode;
        try
        {
            await SendHttpRequestAsync<object>(HttpMethod.Post, "email", emailRequest);
            emailLog.EmailState = EmailState.Pending;
        }
        catch (Exception ex)
        {
            emailLog.EmailState = EmailState.Failed;
            emailLog.ErrorMessage = ex.Message;
        }
    }

    public async Task SendEmailAsync(
        List<string> recipientEmails,
        string content,
        string subject,
        EmailSample emailSample,
        EmailLog emailLog)
    {
        await SendEmailAsync(
            subject,
            content,
            recipientEmails,
            StringListConverter.ConvertStringToList(emailSample.CcEmails),
            StringListConverter.ConvertStringToList(emailSample.BccEmails),
            emailSample.ReplyToEmail,
            emailLog
        );
    }

    public async Task<IEnumerable<EmailProxyLog>?> GetEmailLogsByDateRangeAsync(DateTime from, DateTime to)
    {
        var baseUrl = "get-by-range";
        var query = new Dictionary<string, string?>
        {
            { "project", Information.ProjectName },
            { "dateFrom", from.ToString("dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture) },
            { "dateTo", to.ToString("dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture) }
        };
        var fullUrl = QueryHelpers.AddQueryString(baseUrl, query);
        return await SendHttpRequestAsync<IEnumerable<EmailProxyLog>>(HttpMethod.Post, fullUrl);
    }

    public async Task<IEnumerable<EmailProxyLog>?> GetEmailLogsByIdentifierCodeAsync(List<Guid> identifierCodes)
    {
        var baseUrl = "get-by-identifiers";
        var content = new
        {
            IdentifierCodes = identifierCodes,
            Project = Information.ProjectName,
            Keys = _emailProxySetting.Key,
            CampusCode = _tenantInfo?.FapAccount.CampusCode ?? string.Empty
        };
        return await SendHttpRequestAsync<IEnumerable<EmailProxyLog>>(HttpMethod.Post, baseUrl, content);
    }

    public async Task SendEmailAgainAsync(string emailId)
    {
        if (string.IsNullOrEmpty(emailId))
        {
            throw new ArgumentNullException(nameof(emailId));
        }
        await SendHttpRequestAsync<object>(HttpMethod.Get, $"sent-again?id={emailId}");
    }

    private async Task<T?> SendHttpRequestAsync<T>(HttpMethod method, string url, object? content = null)
    {
        var request = new HttpRequestMessage(method, url);
        if (content != null)
        {
            request.Content = new StringContent(JsonSerializer.Serialize(content, JsonSerializerSettings.CamelCaseOptions), Encoding.UTF8, "application/json");
        }
        var response = await httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<T>();
    }
}
