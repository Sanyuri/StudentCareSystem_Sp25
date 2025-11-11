namespace StudentCareSystem.Domain.Interfaces;

/// <summary>
/// Interface for deletable entities.
/// </summary>
public interface IDeletable
{
    /// <summary>
    /// Gets or sets a value indicating whether the entity has been deleted.
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the entity was deleted.
    /// </summary>
    public DateTime? DeletedAt { get; set; }

    /// <summary>
    /// Gets or sets the username of the person who deleted the entity.
    /// </summary>
    public string? DeletedBy { get; set; }
}


