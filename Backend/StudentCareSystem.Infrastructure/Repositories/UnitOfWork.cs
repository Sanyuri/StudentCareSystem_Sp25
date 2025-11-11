using System.Threading;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class UnitOfWork(
    ScsDbContext context,

    IAbsenceRateBoundaryRepository absenceRateBoundaryRepository,
    IActivityRepository activityRepository,
    IApplicationTypeRepository applicationTypeRepository,
    IAppSettingRepository appSettingRepository,
    IAttendanceHistoryRepository attendanceHistoryRepository,
    IEmailLogRepository emailLogRepository,
    IEmailSampleRepository emailSampleRepository,
    IEmailSubSampleRepository emailSubSampleRepository,
    INoteTypeRepository noteTypeRepository,
    IPermissionRepository permissionRepository,
    IProgressCriterionRepository progressCriterionRepository,
    IProgressCriterionTypeRepository progressCriterionTypeRepository,
    IPsychologyNoteDetailRepository psychologyNoteDetailRepository,
    IPsychologyNoteRepository psychologyNoteRepository,
    IPsychologyNoteTypeRepository psychologyNoteTypeRepository,
    IRefreshTokenRepository refreshTokenRepository,
    IRolePermissionRepository rolePermissionRepository,
    IRoleRepository roleRepository,
    ISemesterRepository semesterRepository,
    IStudentApplicationRepository studentApplicationRepository,
    IStudentAttendanceRepository studentAttendanceRepository,
    IStudentCareAssignmentRepository studentCareAssignmentRepository,
    IStudentDeferRepository studentDeferRepository,
    IStudentNeedCareRepository studentNeedCareRepository,
    IStudentNoteRepository studentNoteRepository,
    IStudentPointRepository studentPointRepository,
    IStudentPsychologyRepository studentPsychologyRepository,
    IStudentRepository studentRepository,
    IStudentSubjectRepository studentSubjectRepository,
    ISubjectRepository subjectRepository,
    IUserEmailLogRepository userEmailLogRepository,
    IUserPermissionRepository userPermissionRepository,
    IUserRepository userRepository
) : IUnitOfWork
{
    private readonly ScsDbContext _context = context;
    private IDbContextTransaction? _transaction;
    private bool _disposed;

    #region Repositories (sorted: dài → ngắn)
    public IStudentCareAssignmentRepository StudentCareAssignmentRepository { get; } = studentCareAssignmentRepository;
    public IProgressCriterionTypeRepository ProgressCriterionTypeRepository { get; } = progressCriterionTypeRepository;
    public IProgressCriterionRepository ProgressCriterionRepository { get; } = progressCriterionRepository;
    public IAbsenceRateBoundaryRepository AbsenceRateBoundaryRepository { get; } = absenceRateBoundaryRepository;
    public IAttendanceHistoryRepository AttendanceHistoryRepository { get; } = attendanceHistoryRepository;
    public IPsychologyNoteDetailRepository PsychologyNoteDetailRepository { get; } = psychologyNoteDetailRepository;
    public IStudentPsychologyRepository StudentPsychologyRepository { get; } = studentPsychologyRepository;
    public IStudentApplicationRepository StudentApplicationRepository { get; } = studentApplicationRepository;
    public IStudentAttendanceRepository StudentAttendanceRepository { get; } = studentAttendanceRepository;
    public IEmailSubSampleRepository EmailSubSampleRepository { get; } = emailSubSampleRepository;
    public IRolePermissionRepository RolePermissionRepository { get; } = rolePermissionRepository;
    public IUserPermissionRepository UserPermissionRepository { get; } = userPermissionRepository;
    public IStudentNeedCareRepository StudentNeedCareRepository { get; } = studentNeedCareRepository;
    public IStudentSubjectRepository StudentSubjectRepository { get; } = studentSubjectRepository;
    public IUserEmailLogRepository UserEmailLogRepository { get; } = userEmailLogRepository;
    public IEmailSampleRepository EmailSampleRepository { get; } = emailSampleRepository;
    public IPsychologyNoteTypeRepository PsychologyNoteTypeRepository { get; } = psychologyNoteTypeRepository;
    public IPsychologyNoteRepository PsychologyNoteRepository { get; } = psychologyNoteRepository;
    public IStudentPointRepository StudentPointRepository { get; } = studentPointRepository;
    public IStudentDeferRepository StudentDeferRepository { get; } = studentDeferRepository;
    public IStudentNoteRepository StudentNoteRepository { get; } = studentNoteRepository;
    public IAppSettingRepository AppSettingRepository { get; } = appSettingRepository;
    public IApplicationTypeRepository ApplicationTypeRepository { get; } = applicationTypeRepository;
    public IEmailLogRepository EmailLogRepository { get; } = emailLogRepository;
    public INoteTypeRepository NoteTypeRepository { get; } = noteTypeRepository;
    public IActivityRepository ActivityRepository { get; } = activityRepository;
    public ISubjectRepository SubjectRepository { get; } = subjectRepository;
    public IUserRepository UserRepository { get; } = userRepository;
    public IRoleRepository RoleRepository { get; } = roleRepository;
    public ISemesterRepository SemesterRepository { get; } = semesterRepository;
    public IRefreshTokenRepository RefreshTokenRepository { get; } = refreshTokenRepository;
    public IPermissionRepository PermissionRepository { get; } = permissionRepository;
    public IStudentRepository StudentRepository { get; } = studentRepository;
    #endregion

    #region Transaction
    public async Task BeginTransactionAsync()
    {
        if (_transaction != null) return;
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction == null) return;

        await _context.SaveChangesAsync();
        await _transaction.CommitAsync();
        await _transaction.DisposeAsync();
        _transaction = null;
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction == null) return;

        await _transaction.RollbackAsync();
        await _transaction.DisposeAsync();
        _transaction = null;
    }
    #endregion

    #region SaveChanges
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => _context.SaveChangesAsync(cancellationToken);

    public int SaveChanges() => _context.SaveChanges();
    #endregion

    #region Dispose
    protected virtual async ValueTask DisposeAsyncCore()
    {
        if (_transaction != null)
        {
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    protected virtual void Dispose(bool disposing)
    {
        if (_disposed) return;

        if (disposing)
        {
            _transaction?.Dispose();
            _context.Dispose();
        }

        _disposed = true;
    }

    public async ValueTask DisposeAsync()
    {
        await DisposeAsyncCore();
        Dispose(false);
        GC.SuppressFinalize(this);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
    #endregion
}
