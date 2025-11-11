using System.Security.Cryptography;
using System.Text;

using StudentCareSystem.Application.Commons.Models;

namespace StudentCareSystem.API.Helpers;

public class CheckSumGeneration(CheckSumSetting options)
{

    public string GenerateCheckSum(string campusCode)
    {
        var currentTime = DateTimeOffset.Now.ToUnixTimeSeconds();
        var input = $"PublicKey1{campusCode} PublicKey2";
        var dataWithTime = input + currentTime;
        using var hmacsha = new HMACSHA256(Encoding.UTF8.GetBytes(options.PrivateKey));
        var hashBytes = hmacsha.ComputeHash(Encoding.UTF8.GetBytes(dataWithTime));
        var checksum = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        return $"{checksum}:{currentTime}";
    }
}
