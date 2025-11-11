using Finbuckle.MultiTenant.Abstractions;

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Models.Tenant;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Infrastructure.Data;

public class ScsDbContext(
    DbContextOptions<ScsDbContext> options,
    IMultiTenantContextAccessor<AppTenantInfo> multiTenantContextAccessor,
    IHttpContextAccessor contextAccessor,
    IConfiguration configuration
) : DbContext(options)
{
    private readonly AppTenantInfo? TenantInfo = multiTenantContextAccessor.MultiTenantContext?.TenantInfo;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (TenantInfo != null)
        {
            optionsBuilder.UseSqlServer(TenantInfo.ConnectionString, sqlServerOptionsAction: sqlOptions =>
            {
                sqlOptions.MigrationsAssembly(typeof(ScsDbContext).Assembly.FullName);
            });
        }
        else
        {
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"), sqlServerOptionsAction: sqlOptions =>
            {
                sqlOptions.MigrationsAssembly(typeof(ScsDbContext).Assembly.FullName);
            });
        }
        base.OnConfiguring(optionsBuilder);
    }

    #region DbSet Properties

    public DbSet<Activity> Activities { get; init; } = null!;
    public DbSet<StudentApplication> StudentApplications { get; set; } = null!;
    public DbSet<ApplicationType> ApplicationTypes { get; set; } = null!;
    public DbSet<EmailSample> EmailSamples { get; init; } = null!;
    public DbSet<EmailSubSample> EmailSubSamples { get; init; } = null!;
    public DbSet<Permission> Permissions { get; init; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; init; } = null!;
    public DbSet<Role> Roles { get; init; } = null!;
    public DbSet<StudentAttendance> StudentAttendances { get; init; } = null!;
    public DbSet<StudentDefer> StudentDefers { get; init; } = null!;
    public DbSet<User> Users { get; init; } = null!;
    public DbSet<Semester> Semesters { get; init; } = null!;
    public DbSet<EmailLog> EmailLogs { get; init; } = null!;
    public DbSet<UserEmailLog> UserEmailLogs { get; init; } = null!;
    public DbSet<Subject> Subjects { get; init; } = null!;
    public DbSet<Student> Students { get; init; } = null!;
    public DbSet<AttendanceHistory> AttendanceHistories { get; init; } = null!;
    public DbSet<AbsenceRateBoundary> AbsenceRateBoundaries { get; init; } = null!;
    public DbSet<StudentNote> StudentNotes { get; init; } = null!;
    public DbSet<NoteType> NoteTypes { get; init; } = null!;
    public DbSet<StudentPoint> StudentPoints { get; init; } = null!;
    public DbSet<StudentPsychology> StudentPsychologies { get; init; } = null!;
    public DbSet<PsychologyNoteType> PsychologyNoteTypes { get; init; } = null!;
    public DbSet<PsychologyNote> PsychologyNotes { get; init; } = null!;
    public DbSet<PsychologyNoteDetail> PsychologyNoteDetails { get; init; } = null!;
    public DbSet<StudentNeedCare> StudentNeedCares { get; init; } = null!;
    public DbSet<ProgressCriterion> ProgressCriteria { get; init; } = null!;
    public DbSet<StudentCareAssignment> StudentCareAssignments { get; init; } = null!;
    public DbSet<ProgressCriterionType> ProgressCriterionTypes { get; init; } = null!;
    public DbSet<StudentSubject> StudentSubjects { get; init; } = null!;
    public DbSet<AppSetting> AppSettings { get; init; } = null!;

    #endregion

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureSequentialIds(modelBuilder);
        ConfigureSoftDelete(modelBuilder);

        modelBuilder.Entity<Student>()
            .HasAlternateKey(e => e.StudentCode);

        modelBuilder.Entity<Subject>()
            .HasAlternateKey(e => e.SubjectCode);

        modelBuilder.Entity<StudentAttendance>()
            .HasOne(e => e.Student)
            .WithMany(s => s.StudentAttendances)
            .HasForeignKey(e => e.StudentCode)
            .HasPrincipalKey(s => s.StudentCode);

        modelBuilder.Entity<StudentApplication>()
            .HasOne(e => e.Student)
            .WithMany(s => s.StudentApplications)
            .HasForeignKey(e => e.StudentCode)
            .HasPrincipalKey(s => s.StudentCode);

        modelBuilder.Entity<StudentDefer>()
            .HasOne(e => e.Student)
            .WithMany(s => s.StudentDefers)
            .HasForeignKey(e => e.StudentCode)
            .HasPrincipalKey(s => s.StudentCode);

        modelBuilder.Entity<StudentNote>()
            .HasOne(e => e.Student)
            .WithMany(s => s.Notes)
            .HasForeignKey(e => e.StudentCode)
            .HasPrincipalKey(s => s.StudentCode);

        modelBuilder.Entity<EmailLog>()
            .HasOne(e => e.Student)
            .WithMany(s => s.EmailLogs)
            .HasForeignKey(e => e.StudentCode)
            .HasPrincipalKey(s => s.StudentCode);

        modelBuilder.Entity<StudentPoint>()
            .HasOne(e => e.Student)
            .WithMany(s => s.StudentPoints)
            .HasForeignKey(e => e.StudentCode)
            .HasPrincipalKey(s => s.StudentCode);

        modelBuilder.Entity<StudentSubject>()
            .HasOne(e => e.Student)
            .WithMany(s => s.StudentSubjects)
            .HasForeignKey(e => e.StudentCode)
            .HasPrincipalKey(s => s.StudentCode);

        modelBuilder.Entity<StudentPsychology>()
            .HasOne(e => e.Student)
            .WithOne(s => s.StudentPsychology)
            .HasForeignKey<StudentPsychology>(e => e.StudentCode)
            .HasPrincipalKey<Student>(s => s.StudentCode);

        modelBuilder.Entity<StudentNeedCare>()
            .HasOne(e => e.Student)
            .WithMany(s => s.StudentNeedCares)
            .HasForeignKey(e => e.StudentCode)
            .HasPrincipalKey(s => s.StudentCode);

        base.OnModelCreating(modelBuilder);
    }

    #region Configuration Methods

    private static void ConfigureSoftDelete(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Activity>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<StudentApplication>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<ApplicationType>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<Subject>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<EmailLog>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<EmailSample>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<EmailSubSample>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<Permission>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<RefreshToken>()
            .HasQueryFilter(e => e.User != null && !e.User.IsDeleted);

        modelBuilder.Entity<Role>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<Semester>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<Student>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<AttendanceHistory>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<StudentAttendance>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<StudentDefer>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<User>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<UserPermission>()
            .HasQueryFilter(e => e.User != null && !e.User.IsDeleted && !e.IsDeleted);

        modelBuilder.Entity<StudentCareAssignment>()
            .HasQueryFilter(e => e.User != null && !e.User.IsDeleted && !e.IsDeleted);

        modelBuilder.Entity<StudentCareAssignment>()
            .HasQueryFilter(e => e.StudentNeedCare != null && !e.StudentNeedCare.IsDeleted && !e.IsDeleted);

        modelBuilder.Entity<ProgressCriterion>()
            .HasQueryFilter(e => e.StudentNeedCare != null && !e.StudentNeedCare.IsDeleted && !e.IsDeleted);

        modelBuilder.Entity<ProgressCriterion>()
            .HasQueryFilter(e => e.ProgressCriterionType != null && !e.ProgressCriterionType.IsDeleted && !e.IsDeleted);

        modelBuilder.Entity<RolePermission>()
            .HasQueryFilter(e => e.Permission != null && !e.Permission.IsDeleted && !e.IsDeleted);

        modelBuilder.Entity<AbsenceRateBoundary>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<StudentNote>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<NoteType>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<StudentPoint>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<StudentSubject>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<StudentPsychology>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<PsychologyNoteType>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<PsychologyNote>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<PsychologyNoteDetail>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<StudentNeedCare>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<ProgressCriterionType>()
            .HasQueryFilter(e => !e.IsDeleted);

        modelBuilder.Entity<AppSetting>()
            .HasQueryFilter(e => !e.IsDeleted);

    }

    private static void ConfigureSequentialIds(ModelBuilder modelBuilder)
    {
        const string DefaultValue = "NEWSEQUENTIALID()";
        modelBuilder.Entity<Activity>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<StudentApplication>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<ApplicationType>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<Subject>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<EmailLog>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<EmailSample>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<EmailSubSample>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<Permission>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<RefreshToken>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<Role>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<Semester>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<Student>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<StudentAttendance>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<StudentDefer>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<User>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<UserPermission>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<RolePermission>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<AttendanceHistory>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<AbsenceRateBoundary>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<StudentNote>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<NoteType>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<StudentPoint>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<StudentPsychology>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<PsychologyNoteType>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<PsychologyNote>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<PsychologyNoteDetail>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<StudentNeedCare>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<ProgressCriterion>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<StudentCareAssignment>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<ProgressCriterionType>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<AppSetting>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<StudentSubject>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);

        modelBuilder.Entity<UserEmailLog>()
            .Property(e => e.Id)
            .HasDefaultValueSql(DefaultValue);
    }

    #endregion

    public override int SaveChanges()
    {
        HandleAuditing();
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        HandleAuditing();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void HandleAuditing()
    {
        var entries = ChangeTracker.Entries<IEntity>();

        var currentUsername = GetCurrentUsername();
        var now = DateTime.UtcNow;

        foreach (var entry in entries)
        {
            if (entry.Entity.CreatedBy != null)
            {
                currentUsername = entry.Entity.CreatedBy;
            }

            currentUsername ??= "System";
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = now;
                    entry.Entity.CreatedBy = currentUsername;
                    break;

                case EntityState.Modified:
                    entry.Entity.UpdatedAt = now;
                    entry.Entity.UpdatedBy = currentUsername;
                    break;

                case EntityState.Deleted:
                    if (entry.Entity is IDeletable softDelete)
                    {
                        entry.State = EntityState.Modified;
                        softDelete.IsDeleted = true;
                        softDelete.DeletedAt = now;
                        softDelete.DeletedBy = currentUsername;
                    }

                    break;

                case EntityState.Detached:
                case EntityState.Unchanged:
                default:
                    break;
            }
        }
    }

    private string? GetCurrentUsername()
    {
        return ClaimsHelper.GetUserEmail(contextAccessor);
    }
}
