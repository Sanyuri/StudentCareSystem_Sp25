using AutoMapper;

using Finbuckle.MultiTenant.Abstractions;

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using Serilog;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.StudentNeedCares;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Cachings;
using StudentCareSystem.Infrastructure.ExternalServices;
using StudentCareSystem.Infrastructure.Models.AIs;
using StudentCareSystem.Infrastructure.Models.Tenant;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;



namespace StudentCareSystem.Application.Services;

public class StudentNeedCareService(
    IMapper mapper,
    IAIService aiService,
    IStudentRepository studentRepository,
    IRedisCacheService redisCacheService,
    ISemesterRepository semesterRepository,
    IHttpContextAccessor httpContextAccessor,
    IStudentNeedCareRepository studentNeedCareRepository,
    IMultiTenantContextAccessor<AppTenantInfo> multiTenantContextAccessor,
    IUnitOfWork unitOfWork
) : IStudentNeedCareService
{
    private readonly string tenantIdentifier = multiTenantContextAccessor.MultiTenantContext?.TenantInfo?.Identifier
                                               ?? throw new ArgumentNullException(multiTenantContextAccessor.MultiTenantContext?.TenantInfo?.Identifier, "Tenant identifier cannot be null.");

    /// <summary>
    /// Adds a new student need care record for the current semester
    /// </summary>
    /// <param name="studentNeedCareDto">The data to create a new student need care record</param>
    /// <returns>A DTO containing the created student need care information</returns>
    /// <exception cref="EntityNotFoundException">Thrown when the semester is not found</exception>
    /// <exception cref="EntityAlreadyExistsException">Thrown when a student need care record already exists for the student in the current semester</exception>
    public async Task<GetStudentNeedCareDto> AddAsync(CreateStudentNeedCareDto studentNeedCareDto)
    {
        // Check if the student need care in the current semester already exists
        var currentSemester = await semesterRepository.GetCurrentSemesterAsync()
                              ?? throw new EntityNotFoundException(
                                  MessageDescription.ExceptionMessageDescription.EntityNotFound("Semester"));
        var specification = new SpecificationBuilder<StudentNeedCare>()
            .Where(s => s.StudentCode == studentNeedCareDto.StudentCode &&
                        s.SemesterName == currentSemester.SemesterName)
            .Build();
        var existingStudentNeedCare = await studentNeedCareRepository.FirstOrDefaultAsync(specification);
        if (existingStudentNeedCare != null)
        {
            throw new EntityAlreadyExistsException(
                MessageDescription.ExceptionMessageDescription.EntityAlreadyExists("Student need care"));
        }
        // Get the previous semester
        var previousSemester = await semesterRepository.GetPreviousSemesterAsync(currentSemester)
                               ?? throw new EntityNotFoundException(
                                   MessageDescription.ExceptionMessageDescription.EntityNotFound("Previous semester"));
        // Add the topsis score and cluster
        var studentResultRequest = new StudentResultRequest
        {
            SemesterName = previousSemester.SemesterName,
            Query = studentNeedCareDto.StudentCode,
            PageNumber = 1,
            PageSize = 1,
        };
        Log.Information("Student result request: {@StudentResultRequest}", studentResultRequest);
        var studentResult = await aiService.GetStudentNeedCareAsync(studentResultRequest);
        if (studentResult.Items.Count == 0)
        {
            throw new EntityNotFoundException(
                MessageDescription.ExceptionMessageDescription.EntityNotFound("Student need care"));
        }
        var studentResultItem = studentResult.Items.First();
        var studentNeedCare = mapper.Map<StudentNeedCare>(studentNeedCareDto);
        studentNeedCare.SemesterName = currentSemester.SemesterName;
        studentNeedCare.Point = studentResultItem.TopsisScore;
        studentNeedCare.Cluster = studentResultItem.Cluster;
        var result = await studentNeedCareRepository.AddAsync(studentNeedCare);
        await unitOfWork.SaveChangesAsync();
        // Update the rank 
        await UpdateRankAsync(currentSemester.SemesterName);
        return mapper.Map<GetStudentNeedCareDto>(result);
    }

    /// <summary>
    /// Retrieves paginated student need care records based on the specified filter criteria
    /// </summary>
    /// <param name="filter">Filter and pagination parameters</param>
    /// <returns>A paginated list of student need care DTOs</returns>
    public async Task<Pagination<GetStudentNeedCareDto>> GetAllWithPaginationAsync(StudentNeedCareFilter filter)
    {
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var userRole = ClaimsHelper.GetUserRole(httpContextAccessor);
        var query = filter.Query?.Trim();
        var specification = new SpecificationBuilder<StudentNeedCare>()
            .Where(s =>
                (string.IsNullOrEmpty(query)
                 || s.StudentCode.Contains(query)
                 || (s.Student != null && s.Student.StudentName.Contains(query))
                )
                && (!filter.UserId.HasValue || s.StudentCareAssignments.Any(x => x.UserId == filter.UserId))
                && (userRole != RoleType.Officer || s.StudentCareAssignments.Any(x => x.UserId == userId))
                && (!filter.Rank.HasValue || s.Rank == filter.Rank)
                && (!filter.IsCollaborating.HasValue || s.IsCollaborating == filter.IsCollaborating)
                && (!filter.IsProgressing.HasValue || s.IsProgressing == filter.IsProgressing)
                && (!filter.NeedsCareNextTerm.HasValue || s.NeedsCareNextTerm == filter.NeedsCareNextTerm)
                && (string.IsNullOrEmpty(filter.SemesterName) || s.SemesterName == filter.SemesterName)
                && (!filter.CareStatus.HasValue || s.CareStatus == filter.CareStatus)
            )
            .Include(s =>
                s.Include(x => x.Student))
            .Include(s =>
                s.Include(x => x.StudentCareAssignments)
                    .ThenInclude(x => x.User))
            .OrderByDescending(s => s.UpdatedAt ?? s.CreatedAt)
            .ApplyPaging(filter.PageNumber, filter.PageSize)
            .UseSplitQueries()
            .Build();
        var result = await studentNeedCareRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<GetStudentNeedCareDto>>(result);
    }

    /// <summary>
    /// Gets a count of student need care records grouped by care status for a specific semester
    /// </summary>
    /// <param name="semesterName">The name of the semester to count records for</param>
    /// <returns>A collection of dictionaries containing care status counts</returns>
    public async Task<IEnumerable<Dictionary<CareStatus, int>>> GetCareStatusCountBySemesterAsync(string semesterName)
    {
        var result = new List<Dictionary<CareStatus, int>>();
        for (var i = 0; i < Enum.GetValues<CareStatus>().Length; i++)
        {
            var careStatus = (CareStatus)i;
            var specification = new SpecificationBuilder<StudentNeedCare>()
                .Where(s => s.SemesterName == semesterName && s.CareStatus == careStatus)
                .Build();
            var count = await studentNeedCareRepository.CountAsync(specification);
            result.Add(new Dictionary<CareStatus, int> { { careStatus, count } });
        }

        return result;
    }

    /// <summary>
    /// Retrieves a specific student need care record by its ID
    /// </summary>
    /// <param name="id">The unique identifier of the student need care record</param>
    /// <returns>The student need care DTO if found</returns>
    /// <exception cref="EntityNotFoundException">Thrown when the student need care record is not found</exception>
    public async Task<GetStudentNeedCareDto> GetByIdAsync(Guid id)
    {
        var specification = new SpecificationBuilder<StudentNeedCare>()
            .Where(s => s.Id == id)
            .Include(s => s.Include(x => x.Student))
            .Build();
        var result = await studentNeedCareRepository.FirstOrDefaultAsync(specification)
                     ?? throw new EntityNotFoundException(
                         MessageDescription.ExceptionMessageDescription.EntityNotFound("Student need care"));
        return mapper.Map<GetStudentNeedCareDto>(result);
    }

    /// <summary>
    /// Scans for students who need care and stores the results in the Redis cache
    /// </summary>
    /// <param name="numberOfStudentNeedCare">The maximum number of students to include in the scan results</param>
    /// <exception cref="EntityNotFoundException">Thrown when the current or previous semester is not found</exception>
    public async Task ScanStudentNeedCareAsync(int numberOfStudentNeedCare)
    {
        var currentSemester = await semesterRepository.GetCurrentSemesterAsync()
                              ?? throw new EntityNotFoundException(
                                  MessageDescription.ExceptionMessageDescription.EntityNotFound("Semester"));
        var previousSemester = await semesterRepository.GetPreviousSemesterAsync(currentSemester)
                               ?? throw new EntityNotFoundException(
                                   MessageDescription.ExceptionMessageDescription.EntityNotFound("Previous semester"));
        var studentNeedCareExitSpecs = new SpecificationBuilder<StudentNeedCare>()
            .Where(s => s.SemesterName == currentSemester.SemesterName)
            .Build();
        var studentNeedCareExits = await studentNeedCareRepository.GetAllAsync(studentNeedCareExitSpecs);
        var studentCodes = studentNeedCareExits.Select(s => s.StudentCode).ToList();
        var studentResultRequest = new StudentResultRequest
        {
            SemesterName = previousSemester.SemesterName,
            OrderByTopsisScore = true,
            PageSize = 500,
            PageNumber = 1,
            IgnoredStudentCodes = [.. studentCodes],
            IsAttendanceExempted = false,
            StatusCodes = [
                StudentStatus.HD.ToString(),
                StudentStatus.HL.ToString()
            ]
        };
        var StudentResults = new List<StudentResultItem>();
        var firstPage = await aiService.GetStudentNeedCareAsync(studentResultRequest);
        StudentResults.AddRange(firstPage.Items);
        var totalPage = firstPage.TotalPages;
        for (var i = 2; i <= totalPage; i++)
        {
            studentResultRequest.PageNumber = i;
            var page = await aiService.GetStudentNeedCareAsync(studentResultRequest);
            StudentResults.AddRange(page.Items);
            if (StudentResults.Count >= numberOfStudentNeedCare)
            {
                break;
            }
        }

        // Get the right number of student need care
        StudentResults = [.. StudentResults.Take(numberOfStudentNeedCare)];
        // Get the student Information
        var studentSpec = new SpecificationBuilder<Student>()
            .Where(s => StudentResults.Select(x => x.StudentCode).Contains(s.StudentCode))
            .Build();
        var students = await studentRepository.GetAllAsync(studentSpec);
        // Generate the student need care
        var studentNeedCares = new List<StudentNeedCare>();
        for (int i = 0; i < StudentResults.Count; i++)
        {
            var studentResult = StudentResults[i];
            var student = students.FirstOrDefault(s => s.StudentCode == studentResult.StudentCode);
            studentNeedCares.Add(new StudentNeedCare
            {
                StudentCode = studentResult.StudentCode,
                Cluster = studentResult.Cluster,
                Point = studentResult.TopsisScore,
                Student = student,
                SemesterName = currentSemester.SemesterName,
                Rank = i + 1,
                CareStatus = CareStatus.NotAssigned,
                IsCollaborating = false,
                IsProgressing = false,
                NeedsCareNextTerm = false,
                FinalComment = string.Empty,
            });
        }

        // Add to the redis cache, different tenant has different cache
        var cacheKey = $"{CacheKey.StudentResults}:{tenantIdentifier}";
        await redisCacheService.SetAsync(cacheKey, studentNeedCares, TimeSpan.FromMinutes(60));
    }

    /// <summary>
    /// Gets the paginated list of students who were identified in the scan
    /// </summary>
    /// <param name="filter">Filter and pagination parameters</param>
    /// <returns>A paginated list of student need care DTOs from the scan</returns>
    /// <exception cref="EntityNotFoundException">Thrown when no scan results are found in the cache</exception>
    public async Task<Pagination<GetStudentNeedCareDto>> GetScannedListAsync(StudentNeedCareFilter filter)
    {
        var cacheKey = $"{CacheKey.StudentResults}:{tenantIdentifier}";
        var studentResults = await redisCacheService.GetTAsync<List<StudentNeedCare>>(cacheKey)
                             ?? throw new EntityNotFoundException(
                                 MessageDescription.ExceptionMessageDescription.EntityNotFound("Student results"));
        var query = filter.Query?.Trim();
        var items = studentResults
            .Where(s =>
                string.IsNullOrEmpty(query)
                || s.StudentCode.Contains(query)
                || (s.Student != null && s.Student.StudentName.Contains(query))
            )
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize);
        var result = new Pagination<GetStudentNeedCareDto>
        {
            Items = [.. mapper.Map<IEnumerable<GetStudentNeedCareDto>>(items)],
            TotalItems = studentResults.Count,
            PageIndex = filter.PageNumber,
            PageSize = filter.PageSize
        };
        return result;
    }

    /// <summary>
    /// Removes a student from the scanned list in the Redis cache
    /// </summary>
    /// <param name="studentCodes">A comma-separated list of student codes to delete</param>
    /// <exception cref="EntityNotFoundException">Thrown when no scan results are found in the cache</exception>
    public async Task DeleteFromScannedListAsync(string studentCodes)
    {
        var cacheKey = $"{CacheKey.StudentResults}:{tenantIdentifier}";
        var studentResults = await redisCacheService.GetTAsync<List<StudentNeedCare>>(cacheKey)
                             ?? throw new EntityNotFoundException(
                                 MessageDescription.ExceptionMessageDescription.EntityNotFound("Student results"));
        studentResults.RemoveAll(s => studentCodes.Contains(s.StudentCode));
        await redisCacheService.SetAsync(cacheKey, studentResults, TimeSpan.FromMinutes(60));
    }

    /// <summary>
    /// Confirms and saves the scanned list of students who need care to the database
    /// </summary>
    /// <exception cref="EntityNotFoundException">Thrown when no scan results are found in the cache</exception>
    public async Task ConfirmScannedListAsync()
    {
        var cacheKey = $"{CacheKey.StudentResults}:{tenantIdentifier}";
        var studentResults = await redisCacheService.GetTAsync<List<StudentNeedCare>>(cacheKey)
                             ?? throw new EntityNotFoundException(
                                 MessageDescription.ExceptionMessageDescription.EntityNotFound("Student results"));
        // Check if there are any results to process
        if (studentResults.Count == 0)
        {
            await redisCacheService.RemoveAsync(cacheKey);
            return;
        }

        // Save and update the rank
        var studentNeedCares = new List<StudentNeedCare>();
        for (int i = 0; i < studentResults.Count; i++)
        {
            var studentResult = studentResults[i];
            studentResult.Student = null;
            studentResult.Rank = i + 1;
            studentNeedCares.Add(studentResult);
        }

        await studentNeedCareRepository.AddBulkAsync(studentNeedCares);
        await unitOfWork.SaveChangesAsync();
        await redisCacheService.RemoveAsync(cacheKey);
    }

    /// <summary>
    /// Updates an existing student need care record
    /// </summary>
    /// <param name="studentNeedCareDto">The updated student need care data</param>
    /// <exception cref="EntityNotFoundException">Thrown when the student need care record is not found</exception>
    public async Task UpdateAsync(UpdateStudentNeedCareDto studentNeedCareDto)
    {
        var studentNeedCare = await studentNeedCareRepository.GetByIdAsync(studentNeedCareDto.Id)
                              ?? throw new EntityNotFoundException(
                                  MessageDescription.ExceptionMessageDescription.EntityNotFound("Student need care"));
        studentNeedCare.CareStatus = studentNeedCareDto.CareStatus;
        studentNeedCare.IsCollaborating = studentNeedCareDto.IsCollaborating;
        studentNeedCare.IsProgressing = studentNeedCareDto.IsProgressing;
        studentNeedCare.NeedsCareNextTerm = studentNeedCareDto.NeedsCareNextTerm;
        studentNeedCare.FinalComment = studentNeedCareDto.FinalComment;
        studentNeedCareRepository.Update(studentNeedCare);
        await unitOfWork.SaveChangesAsync();
    }

    /// <summary>
    /// Deletes a student need care record by its ID
    /// </summary>
    /// <param name="id">The unique identifier of the student need care record to delete</param>
    /// <exception cref="EntityNotFoundException">Thrown when the student need care record is not found</exception>
    public async Task DeleteAsync(Guid id)
    {
        var studentNeedCare = await studentNeedCareRepository.GetByIdAsync(id)
                              ?? throw new EntityNotFoundException(
                                  MessageDescription.ExceptionMessageDescription.EntityNotFound("Student need care"));
        studentNeedCareRepository.Delete(studentNeedCare);
        await unitOfWork.SaveChangesAsync();
    }

    /// <summary>
    /// Analyzes the student care data for a specific semester
    /// </summary>
    /// <param name="semesterName">The name of the semester to analyze</param>
    public async Task AnalyzeStudentNeedCareAsync(string semesterName)
    {
        await aiService.AnalyzeStudentNeedCareAsync(semesterName);
    }

    /// <summary>
    /// Changes the care status of a student need care record
    /// </summary>
    /// <param name="changeStatusDto">The data containing the student need care ID and new status</param>
    /// <exception cref="EntityNotFoundException">Thrown when the student need care record is not found</exception>
    public async Task ChangeStatusAsync(ChangeCareStatusDto changeStatusDto)
    {
        var studentNeedCare = await studentNeedCareRepository.GetByIdAsync(changeStatusDto.Id)
                              ?? throw new EntityNotFoundException(
                                  MessageDescription.ExceptionMessageDescription.EntityNotFound("Student need care"));
        studentNeedCare.CareStatus = changeStatusDto.CareStatus;
        //TODO: Add the logic to update the status of the student need care
        studentNeedCareRepository.Update(studentNeedCare);
        await unitOfWork.SaveChangesAsync();
    }

    /// <summary>
    /// Final evaluation of student care for a specific semester
    /// </summary>
    /// <param name="finalEvaluateStudentCareDto">The data containing the student need care ID and final evaluation details</param>
    /// <exception cref="EntityNotFoundException">Thrown when the semester is not found</exception>
    public async Task FinalEvaluateStudentCareAsync(FinalEvaluateStudentCareDto finalEvaluateStudentCareDto)
    {
        var studentNeedCare = await studentNeedCareRepository.GetByIdAsync(finalEvaluateStudentCareDto.Id)
                              ?? throw new EntityNotFoundException(
                                  MessageDescription.ExceptionMessageDescription.EntityNotFound("Student need care"));
        studentNeedCare.CareStatus = finalEvaluateStudentCareDto.CareStatus;
        studentNeedCare.IsCollaborating = finalEvaluateStudentCareDto.IsCollaborating;
        studentNeedCare.IsProgressing = finalEvaluateStudentCareDto.IsProgressing;
        studentNeedCare.NeedsCareNextTerm = finalEvaluateStudentCareDto.NeedsCareNextTerm;
        studentNeedCare.FinalComment = finalEvaluateStudentCareDto.FinalComment;
        studentNeedCare.CareStatus = CareStatus.Done;
        studentNeedCareRepository.Update(studentNeedCare);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateRankAsync(string semesterName)
    {
        // Lấy tất cả StudentNeedCare của học kỳ cần cập nhật
        var specification = new SpecificationBuilder<StudentNeedCare>()
            .Where(s => s.SemesterName == semesterName)
            .OrderByDescending(s => s.Point)
            .Build();

        var studentNeedCares = await studentNeedCareRepository.GetAllAsync(specification);

        // Cập nhật lại thứ hạng dựa trên Point (cao nhất rank = 1)
        int rank = 1;
        foreach (var studentNeedCare in studentNeedCares)
        {
            studentNeedCare.Rank = rank++;
            studentNeedCareRepository.Update(studentNeedCare);
        }

        await unitOfWork.SaveChangesAsync();
    }
}
