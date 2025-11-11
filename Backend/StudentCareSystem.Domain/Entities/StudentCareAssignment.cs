using System.ComponentModel.DataAnnotations.Schema;

using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class StudentCareAssignment : BaseEntity<Guid>
{
    public Guid StudentNeedCareId { get; set; }
    public Guid UserId { get; set; }
    [ForeignKey("StudentNeedCareId")]
    public virtual StudentNeedCare? StudentNeedCare { get; set; }
    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}

