using StudentCareSystem.Application.Commons.Models.EmailLogs;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Mappings;

public class EmailLogProfile : MapProfile
{
    public EmailLogProfile()
    {
        CreateMap<EmailLog, GetEmailLogDto>();
        CreateMap<EmailLog, GetEmailLogDetailDto>()
            .ForMember(dest => dest.CcEmails,
                opt => opt.MapFrom(src => StringListConverter.ConvertStringToList(src.CcEmails, ",")))
            .ForMember(dest => dest.BccEmails,
                opt => opt.MapFrom(src => StringListConverter.ConvertStringToList(src.BccEmails, ",")));
    }
}
