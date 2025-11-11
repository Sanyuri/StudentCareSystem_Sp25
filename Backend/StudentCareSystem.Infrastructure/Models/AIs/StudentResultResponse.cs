namespace StudentCareSystem.Infrastructure.Models.AIs;

using System;

public class StudentResultItem
{
    public Guid Id { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public double GpaGap { get; set; }
    public int NumberOfRemainingFailSubjects { get; set; }
    public double AbsenceRate { get; set; }
    public bool IsAttendanceExempted { get; set; }
    public double TopsisScore { get; set; }
    public int Cluster { get; set; }
}
