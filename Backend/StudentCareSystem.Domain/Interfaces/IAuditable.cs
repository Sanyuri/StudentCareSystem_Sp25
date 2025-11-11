namespace StudentCareSystem.Domain.Interfaces;

/// <summary>
/// Interface for auditing entities.
/// </summary>
public interface IAuditable
{
    /// <summary>
    /// Gets or sets the date and time when the entity was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets the date and time when the entity was last updated.
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// Gets or sets the username of the person who created the entity.
    /// </summary>
    public string? CreatedBy { get; set; }

    /// <summary>
    /// Gets or sets the username of the person who last updated the entity.
    /// </summary>
    public string? UpdatedBy { get; set; }
}


