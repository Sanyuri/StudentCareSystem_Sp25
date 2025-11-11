using StudentCareSystem.Application.Commons.Models.UserEmailLogs;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Mappings;

public class UserEmailLogProfile : MapProfile
{
    public UserEmailLogProfile()
    {
        CreateMap<UserEmailLog, GetUserEmailLogDto>();

        CreateMap<UserEmailLog, GetUserEmailLogDetailDto>()
            .ForMember(dest => dest.CcEmails,
                opt => opt.MapFrom(src => StringListConverter.ConvertStringToList(src.CcEmails, ",")))
            .ForMember(dest => dest.BccEmails,
                opt => opt.MapFrom(src => StringListConverter.ConvertStringToList(src.BccEmails, ",")));

        CreateMap<EmailLog, UserEmailLog>();
    }
}
