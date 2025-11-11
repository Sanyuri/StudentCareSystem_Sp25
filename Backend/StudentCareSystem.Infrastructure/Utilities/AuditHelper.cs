using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Infrastructure.Utilities;


public static class AuditHelper
{
    public static void AuditInformation<T>(
        T entity,
        EntityState state,
        string? currentUser
    ) where T : class, IEntity
    {
        var time = DateTime.UtcNow;
        if (entity.CreatedBy != null)
        {
            currentUser = entity.CreatedBy;
        }
        currentUser ??= "System";
        if (state == EntityState.Added)
        {
            entity.CreatedBy = currentUser;
            entity.CreatedAt = time;
        }
        else if (state == EntityState.Modified)
        {
            entity.UpdatedBy = currentUser;
            entity.UpdatedAt = time;
        }
        else if (state == EntityState.Deleted && entity is IDeletable deletableEntity)
        {
            deletableEntity.DeletedAt = time;
            deletableEntity.DeletedBy = currentUser;
            deletableEntity.IsDeleted = true;
        }
    }


}

