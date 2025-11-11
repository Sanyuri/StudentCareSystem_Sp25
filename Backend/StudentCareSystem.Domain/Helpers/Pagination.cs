using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Domain.Helpers;

public class Pagination<T>
{
    public int TotalItems { get; set; }
    public int PageSize { get; set; }

    public int TotalPages
    {
        get
        {
            if (PageSize == 0) return 0;
            var temp = TotalItems / PageSize;
            return TotalItems % PageSize == 0 ? temp : temp + 1;
        }
    }

    public int PageIndex { get; set; }

    //page number start to 1
    public bool HasPreviousPage => PageIndex > 1;
    public bool HasNextPage => PageIndex < TotalPages;
    public ICollection<T> Items { get; set; } = [];

    public Pagination()
    {
        TotalItems = 0;
        PageSize = 1;
        PageIndex = 1;
    }
}
