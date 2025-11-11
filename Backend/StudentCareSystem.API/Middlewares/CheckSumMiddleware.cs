using System.Security.Cryptography;
using System.Text;

using Microsoft.Extensions.Options;

using StudentCareSystem.Application.Commons.Models;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Middlewares;

public class CheckSumMiddleware(RequestDelegate next, IOptions<CheckSumSetting> options)
{
    private readonly RequestDelegate _next = next;
    private readonly CheckSumSetting _checkSumSetting = options.Value;

    public async Task InvokeAsync(HttpContext context)
    {
        // Ignore the middleware if the request has the attribute "IgnoreCheckSum"
        var endpoint = context.GetEndpoint();
        if (endpoint?.Metadata?.GetMetadata<SkipChecksumAttribute>() != null)
        {
            await _next(context);
            return;
        }

        //Get token from header
        var checkSum = (context.Request.Headers["Check-sum"].FirstOrDefault()?.Split(" ").Last())
            ?? throw new KeyNotFoundException($"Check-sum {MessageDescription.ExceptionMessageDescription.HeaderNotFound}");

        //split the token to hash and timestamp
        var checkSumData = checkSum.Split(":");
        //Get the hash
        var hash = checkSumData[0];
        //Get the timestamp
        var timestamp = checkSumData[1];
        //Get current time in seconds
        var currentTime = DateTimeOffset.Now.ToUnixTimeSeconds();
        //Check if the token is expired
        if (currentTime - Convert.ToInt64(timestamp) > _checkSumSetting.PeriodSeconds)
        {
            throw new UnauthorizedAccessException($"Check-sum {MessageDescription.ExceptionMessageDescription.TokenExpired}");
        }

        //get campus code from header
        var campusCode = context.Request.Headers["CampusCode"].FirstOrDefault();
        var input = $"PublicKey1{campusCode} PublicKey2";
        var dataWithTime = input + timestamp;
        //Use HMAC with the secret key to hash the data
        using var hmacsha = new HMACSHA256(Encoding.UTF8.GetBytes(_checkSumSetting.PrivateKey));
        var hashBytes = hmacsha.ComputeHash(Encoding.UTF8.GetBytes(dataWithTime));
        var checksum = Convert.ToHexStringLower(hashBytes);
        //Compare the hash from the token with the hash generated
        if (!checksum.Equals(hash))
        {
            //If the hash is not the same, return 401
            throw new UnauthorizedAccessException(MessageDescription.ExceptionMessageDescription.Invalid("Check-sum"));
        }
        await _next(context);
    }
}
