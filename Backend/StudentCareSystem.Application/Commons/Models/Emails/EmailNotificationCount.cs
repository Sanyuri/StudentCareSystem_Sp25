using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.Emails;

public class EmailNotificationCount
{
    public int Total { get; set; }
    public int Sent { get; set; }
    public int Failed { get; set; }
    public int Pending { get; set; }
    public DateTime Date { get; set; }

    public EmailNotificationCount(Dictionary<EmailState, int> emailStates, DateTime date)
    {
        Total = emailStates.Values.Sum();
        Sent = emailStates?.GetValueOrDefault(EmailState.Sent) ?? 0;
        Failed = emailStates?.GetValueOrDefault(EmailState.Failed) ?? 0;
        Pending = emailStates?.GetValueOrDefault(EmailState.Pending) ?? 0;
        Date = date;
    }


}
