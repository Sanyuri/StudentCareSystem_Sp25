using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Domain.Interfaces;

/// <summary>
/// Interface representing a generic entity.
/// </summary>
public interface IEntity : IDeletable, IAuditable
{

}

/// <summary>
/// Abstract base class for entities with common properties.
/// Implements IEntity, IDeletable, and IAuditable interfaces.
/// </summary>
/// <typeparam name="TKey">The type of the primary key.</typeparam>
public abstract class BaseEntity<TKey> : IEntity
{
    /// <summary>
    /// Gets or sets the unique identifier of the entity.
    /// </summary>
    [Key]
    public TKey? Id { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the entity is deleted.
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the entity was deleted.
    /// </summary>
    public DateTime? DeletedAt { get; set; }

    /// <summary>
    /// Gets or sets the identifier of the user who deleted the entity.
    /// </summary>
    public string? DeletedBy { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the entity was created.
    /// </summary>
    [DisplayName("Ngày tạo")]
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the entity was last updated.
    /// </summary>
    [DisplayName("Cập nhật lần cuối")]
    public DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// Gets or sets the identifier of the user who created the entity.
    /// </summary>
    [DisplayName("Người tạo")]
    public string? CreatedBy { get; set; }

    /// <summary>
    /// Gets or sets the identifier of the user who last updated the entity.
    /// </summary>
    [DisplayName("Người cập nhật gần nhất")]
    public string? UpdatedBy { get; set; }
}

