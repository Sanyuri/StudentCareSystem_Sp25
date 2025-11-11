using StudentCareSystem.Application.Commons.Models.EmailSubSamples;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Infrastructure.Utilities;


namespace StudentCareSystem.Application.Mappings;

public class EmailSubSampleProfile : MapProfile
{
    public EmailSubSampleProfile()
    {
        CreateMap<EmailSubSample, GetEmailSubSampleDto>();

        CreateMap<UpdateEmailSubSampleDto, EmailSubSample>();

        CreateMap<CreateEmailSubSampleDto, EmailSubSample>();
    }
}
