namespace StudentCareSystem.Infrastructure.Models.AIs;

public class ResponseObject<T>
{
    public T? Data { get; set; }
    public string Message { get; set; } = string.Empty;
    public int Status { get; set; }
    public DateTime Timestamp { get; set; }
}
