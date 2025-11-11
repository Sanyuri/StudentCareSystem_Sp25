namespace StudentCareSystem.Infrastructure.Models.Students;

public class FapStudentResponse
{
    public int TotalPages { get; set; }
    public int TotalRecords { get; set; }
    public IEnumerable<FapStudentData> Data { get; set; } = [];
}


public class FapStudentData
{
    public string Major { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string Fullname { get; set; } = string.Empty;
    public string Progress { get; set; } = string.Empty;
    public string RollNumber { get; set; } = string.Empty;
    public string MemberCode { get; set; } = string.Empty;
    public string StatusCode { get; set; } = string.Empty;
    public int CurrentTermNo { get; set; }
    public string Specialization { get; set; } = string.Empty;
    public string MobilePhone { get; set; } = string.Empty;
    public string ParentPhone { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
}
