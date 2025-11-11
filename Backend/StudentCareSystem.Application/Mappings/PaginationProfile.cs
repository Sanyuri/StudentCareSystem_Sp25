using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Mappings;

public class PaginationProfile : MapProfile
{
    public PaginationProfile()
    {
        CreateMap(typeof(Pagination<>), typeof(Pagination<>));
    }
}
