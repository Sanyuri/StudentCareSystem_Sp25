
namespace StudentCareSystem.Application.Commons.Models.Apis;

public class ApiRequest<T>(T data)
{
    public T Data { get; set; } = data;
    public long Timestamp { get; set; } = DateTimeOffset.Now.ToUnixTimeSeconds();
}

