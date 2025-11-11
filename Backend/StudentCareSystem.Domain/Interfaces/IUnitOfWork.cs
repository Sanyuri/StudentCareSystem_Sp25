using System;
using System.Threading;

namespace StudentCareSystem.Domain.Interfaces;

public interface IUnitOfWork : IAsyncDisposable, IDisposable
{
    Task BeginTransactionAsync();

    Task CommitTransactionAsync();

    Task RollbackTransactionAsync();

    #region Repositories

    IAbsenceRateBoundaryRepository AbsenceRateBoundaryRepository { get; }

    IActivityRepository ActivityRepository { get; }

    IApplicationTypeRepository ApplicationTypeRepository { get; }

    IAppSettingRepository AppSettingRepository { get; }

    IAttendanceHistoryRepository AttendanceHistoryRepository { get; }

    IEmailLogRepository EmailLogRepository { get; }

    IEmailSampleRepository EmailSampleRepository { get; }

    IEmailSubSampleRepository EmailSubSampleRepository { get; }

    INoteTypeRepository NoteTypeRepository { get; }

    IPermissionRepository PermissionRepository { get; }

    IProgressCriterionRepository ProgressCriterionRepository { get; }

    IProgressCriterionTypeRepository ProgressCriterionTypeRepository { get; }

    IPsychologyNoteDetailRepository PsychologyNoteDetailRepository { get; }

    IPsychologyNoteRepository PsychologyNoteRepository { get; }

    IPsychologyNoteTypeRepository PsychologyNoteTypeRepository { get; }

    IRefreshTokenRepository RefreshTokenRepository { get; }

    IRolePermissionRepository RolePermissionRepository { get; }

    IRoleRepository RoleRepository { get; }

    ISemesterRepository SemesterRepository { get; }

    IStudentApplicationRepository StudentApplicationRepository { get; }

    IStudentAttendanceRepository StudentAttendanceRepository { get; }

    IStudentCareAssignmentRepository StudentCareAssignmentRepository { get; }

    IStudentDeferRepository StudentDeferRepository { get; }

    IStudentNeedCareRepository StudentNeedCareRepository { get; }

    IStudentNoteRepository StudentNoteRepository { get; }

    IStudentPointRepository StudentPointRepository { get; }

    IStudentPsychologyRepository StudentPsychologyRepository { get; }

    IStudentRepository StudentRepository { get; }

    IStudentSubjectRepository StudentSubjectRepository { get; }

    ISubjectRepository SubjectRepository { get; }

    IUserEmailLogRepository UserEmailLogRepository { get; }

    IUserPermissionRepository UserPermissionRepository { get; }

    IUserRepository UserRepository { get; }

    #endregion

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    int SaveChanges();
}
