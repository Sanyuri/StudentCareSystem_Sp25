using StudentCareSystem.Application.Commons.Models.EmailSamples;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Infrastructure.Utilities;


namespace StudentCareSystem.Application.Mappings;

public class EmailSampleProfile : MapProfile
{
    public EmailSampleProfile()
    {
        CreateMap<EmailSample, GetEmailSampleDto>()
        .ForMember(dest => dest.CcEmails,
            opt => opt.MapFrom(src => StringListConverter.ConvertStringToList(src.CcEmails, ",")))
        .ForMember(dest => dest.BccEmails,
            opt => opt.MapFrom(src => StringListConverter.ConvertStringToList(src.BccEmails, ",")));

        CreateMap<UpdateEmailSampleDto, EmailSample>()
        .ForMember(dest => dest.CcEmails,
            opt => opt.MapFrom(src => StringListConverter.ConvertListToString(src.CcEmails, ",")))
        .ForMember(dest => dest.BccEmails,
            opt => opt.MapFrom(src => StringListConverter.ConvertListToString(src.BccEmails, ",")));

        CreateMap<CreateEmailSampleDto, EmailSample>()
        .ForMember(dest => dest.CcEmails,
            opt => opt.MapFrom(src => StringListConverter.ConvertListToString(src.CcEmails, ",")))
        .ForMember(dest => dest.BccEmails,
            opt => opt.MapFrom(src => StringListConverter.ConvertListToString(src.BccEmails, ",")));
    }
}
