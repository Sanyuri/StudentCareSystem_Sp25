using AutoMapper;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.StudentNeedCareAssignments;
using StudentCareSystem.Application.Commons.Models.Users;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;

namespace StudentCareSystem.Application.Services;

public class StudentCareAssignmentService(
    IMapper mapper,
    IUserRepository userRepository,
    ISemesterRepository semesterRepository,
    IStudentNeedCareRepository studentNeedCareRepository,
    IStudentCareAssignmentRepository studentCareAssignmentRepository,
    IUnitOfWork unitOfWork
) : IStudentCareAssignmentService
{
    /// <summary>
    /// Adds a new student care assignment linking a student need care record with a user
    /// </summary>
    /// <param name="createStudentCareAssignmentDto">The data to create a new assignment</param>
    /// <returns>A DTO containing the created assignment information</returns>
    /// <exception cref="EntityNotFoundException">Thrown when either the student need care or user doesn't exist</exception>
    /// <exception cref="EntityAlreadyExistsException">Thrown when the assignment already exists</exception>
    public async Task<GetStudentCareAssignmentDto> AddAsync(CreateStudentCareAssignmentDto createStudentCareAssignmentDto)
    {
        var studentNeedCareId = createStudentCareAssignmentDto.StudentNeedCareId;
        var userId = createStudentCareAssignmentDto.UserId;
        var studentNeedCare = await CheckStudentNeedCareExist(studentNeedCareId);
        await CheckUserExist(userId);
        //Check if the student need care has been assigned to the user
        var specification = new SpecificationBuilder<StudentCareAssignment>()
            .Where(s => s.StudentNeedCareId == studentNeedCareId && s.UserId == userId)
            .Build();
        var existingStudentCareAssignment = await studentCareAssignmentRepository.FirstOrDefaultAsync(specification);

        // Check the status of the student need care
        if (studentNeedCare.CareStatus == CareStatus.Done)
        {
            throw new EntityNotFoundException("Student need care is not in a state to be assigned");
        }
        // If the status is NotAssigned change it to Todo

        if (studentNeedCare.CareStatus == CareStatus.NotAssigned)
        {
            studentNeedCare.CareStatus = CareStatus.Todo;
            studentNeedCareRepository.Update(studentNeedCare);
        }

        if (existingStudentCareAssignment != null)
        {
            throw new EntityAlreadyExistsException("Student need care has been assigned to the user");
        }
        var studentCareAssignment = new StudentCareAssignment
        {
            StudentNeedCareId = studentNeedCareId,
            UserId = userId
        };
        var result = await studentCareAssignmentRepository.AddAsync(studentCareAssignment);
        await unitOfWork.SaveChangesAsync();
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetStudentCareAssignmentDto>(result);
    }

    /// <summary>
    /// Updates an existing student care assignment
    /// </summary>
    /// <param name="updateStudentCareAssignmentDto">The updated assignment data</param>
    /// <exception cref="EntityNotFoundException">Thrown when either the student need care or user doesn't exist</exception>
    /// <exception cref="EntityAlreadyExistsException">Thrown when an assignment with the updated values already exists</exception>
    public async Task UpdateAsync(UpdateStudentCareAssignmentDto updateStudentCareAssignmentDto)
    {
        await CheckUserExist(updateStudentCareAssignmentDto.UserId);
        var studentNeedCare = await CheckStudentNeedCareExist(updateStudentCareAssignmentDto.StudentNeedCareId);
        // Check if the student is already assigned to the new user
        var studentCareAssignment = await studentCareAssignmentRepository.GetByIdAsync(updateStudentCareAssignmentDto.Id)
            ?? throw new EntityNotFoundException("Student care assignment not found");

        // Check the status of the student need care
        if (studentNeedCare.CareStatus == CareStatus.Done)
        {
            throw new EntityNotFoundException("Student need care is not in a state to be assigned");
        }
        // If the status is NotAssigned change it to Todo
        if (studentNeedCare.CareStatus == CareStatus.NotAssigned)
        {
            studentNeedCare.CareStatus = CareStatus.Todo;
            studentNeedCareRepository.Update(studentNeedCare);
        }

        // Check for duplicate assignment (excluding the current one)
        var specification = new SpecificationBuilder<StudentCareAssignment>()
            .Where(s => s.StudentNeedCareId == updateStudentCareAssignmentDto.StudentNeedCareId &&
                        s.UserId == updateStudentCareAssignmentDto.UserId &&
                        s.Id != updateStudentCareAssignmentDto.Id) // Exclude current record
            .Build();
        var existingAssignment = await studentCareAssignmentRepository.FirstOrDefaultAsync(specification);
        if (existingAssignment != null)
        {
            throw new EntityAlreadyExistsException("Student need care has been assigned to the user");
        }

        // Update fields
        studentCareAssignment.StudentNeedCareId = updateStudentCareAssignmentDto.StudentNeedCareId;
        studentCareAssignment.UserId = updateStudentCareAssignmentDto.UserId;
        studentCareAssignmentRepository.Update(studentCareAssignment);
        await unitOfWork.SaveChangesAsync();
        await unitOfWork.SaveChangesAsync();

    }

    /// <summary>
    /// Automatically assigns students who need care to available officers.
    /// </summary>
    /// <exception cref="EntityNotFoundException">
    /// Thrown when there is no current semester, no students needing care, or no officers available.
    /// </exception>
    public async Task AutoAssignStudentNeedCareToUserAsync()
    {
        var currentSemester = await semesterRepository.GetCurrentSemesterAsync()
            ?? throw new EntityNotFoundException("There is no current semester");
        //#1 Check if there is any student need care that has not been assigned to any user
        var studentNeedCares = await GetUnassignedStudentNeedCaresAsync(currentSemester.SemesterName);

        //#2 Get All Offier have role user
        var users = await GetActiveOfficersAsync();
        if (users.Count == 0)
            throw new EntityNotFoundException("No officers");

        //#3 Distribute student need care to each officer
        var studentNeedCareCount = studentNeedCares.Count();
        var userCount = users.Count;
        var studentNeedCarePerUser = studentNeedCareCount / userCount;
        var remainingStudentNeedCare = studentNeedCareCount % userCount;
        var studentNeedCareIndex = 0;
        var studentCareAssignments = new List<StudentCareAssignment>();
        foreach (var user in users)
        {
            var studentNeedCareToAssign = studentNeedCarePerUser;
            if (remainingStudentNeedCare > 0)
            {
                studentNeedCareToAssign++;
                remainingStudentNeedCare--;
            }
            for (var i = 0; i < studentNeedCareToAssign; i++)
            {
                var studentNeedCare = studentNeedCares.ElementAt(studentNeedCareIndex);
                var studentCareAssignment = new StudentCareAssignment
                {
                    StudentNeedCareId = studentNeedCare.Id,
                    UserId = user.Id
                };
                studentCareAssignments.Add(studentCareAssignment);
                studentNeedCareIndex++;
            }
        }
        // Change the status of the student need care to assigned
        foreach (var studentNeedCare in studentNeedCares)
        {
            studentNeedCare.CareStatus = CareStatus.Todo;

        }
        await studentCareAssignmentRepository.AddRangeAsync(studentCareAssignments);
        await unitOfWork.SaveChangesAsync();
        await studentNeedCareRepository.UpdateBulkAsync(studentNeedCares);
    }

    /// <summary>
    /// Automatically assigns students who need care to officers based on a percentage distribution.
    /// </summary>
    /// <param name="userPercentages">A set of user assignment percentages.</param>
    /// <exception cref="EntityNotFoundException">
    /// Thrown when there is no current semester, no unassigned students, or no officers available.
    /// </exception>
    /// <exception cref="ArgumentException">
    /// Thrown when the percentage map contains invalid user IDs or the total percentage is not 100%.
    /// </exception>
    public async Task AutoAssignStudentNeedCareToUserAsync(HashSet<UserAssignmentPercentageDto> userPercentages)
    {
        var currentSemester = await semesterRepository.GetCurrentSemesterAsync()
            ?? throw new EntityNotFoundException("No current semester");

        var studentNeedCares = await GetUnassignedStudentNeedCaresAsync(currentSemester.SemesterName);
        if (studentNeedCares.Count == 0)
            throw new EntityNotFoundException("No unassigned students");

        var users = await GetActiveOfficersAsync();
        if (users.Count == 0)
            throw new EntityNotFoundException("No officers");

        var userIds = userPercentages.Select(up => up.UserId).ToHashSet();
        var invalidUserIds = userIds.Except(users.Select(u => u.Id)).ToList();
        if (invalidUserIds.Count != 0)
            throw new ArgumentException($"Invalid user IDs in percentage map: {string.Join(", ", invalidUserIds)}");

        ValidatePercentageMap(userPercentages);

        var assignments = GenerateAssignments(studentNeedCares, users, userPercentages);

        foreach (var s in studentNeedCares)
        {
            s.CareStatus = CareStatus.Todo;
            studentNeedCareRepository.Update(s);
        }

        await studentCareAssignmentRepository.AddRangeAsync(assignments);
        await unitOfWork.SaveChangesAsync();
    }

    /// <summary>
    /// Validates the percentage map to ensure the total percentage equals 100%.
    /// </summary>
    /// <param name="userPercentages">A set of user assignment percentages.</param>
    /// <exception cref="ArgumentException">Thrown when the total percentage is not 100%.</exception>
    private static void ValidatePercentageMap(HashSet<UserAssignmentPercentageDto> userPercentages)
    {
        var total = userPercentages.Sum(up => up.Percentage);
        if (Math.Abs(total - 1.0) > 0.01)
        {
            throw new ArgumentException("Total percentage must equal 100%");
        }
    }

    /// <summary>
    /// Generates student care assignments based on the provided percentage distribution.
    /// </summary>
    /// <param name="studentNeedCares">List of students needing care.</param>
    /// <param name="users">List of available officers.</param>
    /// <param name="userPercentages">A set of user assignment percentages.</param>
    /// <returns>A list of student care assignments.</returns>
    private List<StudentCareAssignment> GenerateAssignments(
        List<StudentNeedCare> studentNeedCares,
        List<User> users,
        HashSet<UserAssignmentPercentageDto> userPercentages)
    {
        var assignments = new List<StudentCareAssignment>();
        int total = studentNeedCares.Count;
        int assigned = 0;
        int index = 0;

        foreach (var percentage in userPercentages)
        {
            var userId = percentage.UserId;
            var count = (int)Math.Floor(percentage.Percentage * total);
            var user = users.FirstOrDefault(u => u.Id == userId);
            if (user == null) continue;

            for (int i = 0; i < count && index < total; i++)
            {
                assignments.Add(new StudentCareAssignment
                {
                    StudentNeedCareId = studentNeedCares[index++].Id,
                    UserId = user.Id
                });
                assigned++;
            }
        }

        var remaining = total - assigned;
        var queue = new Queue<Guid>(userPercentages.Select(up => up.UserId));
        while (remaining-- > 0 && index < total)
        {
            var userId = queue.Dequeue();
            var user = users.First(u => u.Id == userId);
            assignments.Add(new StudentCareAssignment
            {
                StudentNeedCareId = studentNeedCares[index++].Id,
                UserId = user.Id
            });
            queue.Enqueue(userId);
        }

        return assignments;
    }

    /// <summary>
    /// Gets the count of student care assignments grouped by user and care status for a specific semester.
    /// </summary>
    /// <param name="semesterName">The name of the semester to get counts for.</param>
    /// <returns>A collection of user assignment counts with care status breakdown.</returns>
    public async Task<IEnumerable<GetCountStudentCareDto>> GetAssignmentCountByUserBySemesternameAsync(string semesterName)
    {
        var result = await studentCareAssignmentRepository.GetAssignmentCountByUserBySemestername(semesterName);
        return result.Select(x => new GetCountStudentCareDto
        {
            User = mapper.Map<GetUserDto>(x.Key),
            CareStatusCount = x.Value
        });
    }

    /// <summary>
    /// Checks if a user exists with the specified ID.
    /// </summary>
    /// <param name="userId">The user ID to check.</param>
    /// <exception cref="EntityNotFoundException">Thrown when the user doesn't exist.</exception>
    private async Task CheckUserExist(Guid userId)
    {
        if (await userRepository.GetByIdAsync(userId) == null)
            throw new EntityNotFoundException("User not found");
    }

    /// <summary>
    /// Checks if a student need care record exists with the specified ID and returns it.
    /// </summary>
    /// <param name="studentNeedCareId">The student need care ID to check.</param>
    /// <returns>The student need care entity if found.</returns>
    /// <exception cref="EntityNotFoundException">Thrown when the student need care doesn't exist.</exception>
    private async Task<StudentNeedCare> CheckStudentNeedCareExist(Guid studentNeedCareId)
    {
        var studentNeedCare = await studentNeedCareRepository.GetByIdAsync(studentNeedCareId)
            ?? throw new EntityNotFoundException("Student need care not found");
        return studentNeedCare;
    }

    /// <summary>
    /// Gets all student need care records that are unassigned for a specific semester.
    /// </summary>
    /// <param name="semesterName">The semester name to filter by.</param>
    /// <returns>A list of unassigned student need care records.</returns>
    /// <exception cref="EntityNotFoundException">Thrown when no unassigned student need care records are found.</exception>
    private async Task<List<StudentNeedCare>> GetUnassignedStudentNeedCaresAsync(string semesterName)
    {
        var spec = new SpecificationBuilder<StudentNeedCare>()
            .Include(s => s.Include(x => x.StudentCareAssignments))
            .Where(s => !s.StudentCareAssignments.Any() && s.SemesterName == semesterName)
            .Build();
        var result = await studentNeedCareRepository.GetAllAsync(spec);
        return [.. result];
    }

    /// <summary>
    /// Gets all active officers in the system.
    /// </summary>
    /// <returns>A list of users with the officer role.</returns>
    private async Task<List<User>> GetActiveOfficersAsync()
    {
        var spec = new SpecificationBuilder<User>()
            .Include(s => s.Include(x => x.Role))
            .Where(s => s.Role != null
                && s.Role.RoleType == RoleType.Officer
                && s.Status == UserStatus.Active
                )
            .Build();
        var result = await userRepository.GetAllAsync(spec);
        return [.. result];
    }
}
