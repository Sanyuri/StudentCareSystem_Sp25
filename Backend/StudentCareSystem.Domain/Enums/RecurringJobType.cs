namespace StudentCareSystem.Domain.Enums;

public static class RecurringJobType
{
    public static readonly string ScanAttendance = "scan-attendance";
    public static readonly string SemesterScan = "semester-scan";
    public static readonly string SendAttendanceNotification = "send-attendance-notification";
    public static readonly string SendEmailAgain = "send-email-again";
    public static readonly string ScanStudent = "scan-student";
    public static readonly string ScanStudentDefer = "scan-student-defer";
    public static readonly string ScanSubject = "scan-subject";
    public static readonly string ScanStudentPoint = "scan-student-point";
    public static readonly string ScanStudentSubject = "scan-student-subject";
    public static readonly string AnalyzeStudentNeedCare = "analyze-student-need-care";
    public static readonly string ScanFailedJob = "scan-failed-job";
    public static readonly string SendEmailStatistics = "send-email-statistics";
}
