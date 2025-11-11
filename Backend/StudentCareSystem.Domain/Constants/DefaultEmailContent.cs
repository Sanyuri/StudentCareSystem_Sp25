namespace StudentCareSystem.Domain.Constants
{
    public static class DefaultEmailContent
    {
        public const string StudentAttendanceSubject = "Student Attendance Notification";
        public const string StudentAttendanceContent = @"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Student Attendance Notification</title>
</head>
<body>
    <p>Dear {{StudentName}}-{{StudentCode}},</p>
    <p>The DVSV Center notifies you that your absence rate is: {{AbsenceRate}}% and your total absences are: {{TotalAbsences}} days.</p>
    <p>To ensure you are not disqualified from the course due to exceeding the 20% absence rate, please:</p>
    <ul>
        <li>Attend class fully and regularly monitor your absence status on the FAP system;</li>
        <li>If you encounter any issues with attendance, promptly contact your instructor via email within 24 hours to resolve them.</li>
    </ul>
    <p>For further support, contact the DVSV Center via email: <a href='mailto:dvsv.fptuqn@fe.edu.vn'>dvsv.fptuqn@fe.edu.vn</a> or hotline: 0256 730 8668.</p>
    <p>Wishing you good studies.<br>Regards.</p>
</body>
</html>";
    }
}
