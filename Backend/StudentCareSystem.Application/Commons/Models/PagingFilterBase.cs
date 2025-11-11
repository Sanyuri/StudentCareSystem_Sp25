using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models
{
    public class PagingFilterBase
    {
        [Range(1, int.MaxValue)]
        public int PageNumber { get; set; } = 1;
        [Range(1, 1000)]
        public int PageSize { get; set; } = 1000;
    }
}
