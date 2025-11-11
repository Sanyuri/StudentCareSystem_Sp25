using System.Security.Claims;

using Application.Commons.Models.StudentPsychology;

using AutoMapper;

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models;
using StudentCareSystem.Application.Commons.Models.StudentPsychologies;
using StudentCareSystem.Application.Commons.Utilities;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;



namespace StudentCareSystem.Application.Services;

public class StudentPsychologyService(
    IMapper mapper,
    IHttpContextAccessor contextAccessor,
    IOptions<JwtSetting> jwtSetting,
    IUnitOfWork unitOfWork
) : IStudentPsychologyService
{
    private const string StudentPsychologyNotFoundMessage = "Student psychology not found.";
    private readonly JwtSetting jwtSetting = jwtSetting.Value;

    /// <summary>
    /// Gets all student psychology records with pagination.
    /// </summary>
    /// <param name="filter">The filter criteria for student psychology records.</param>
    /// <returns>A paginated list of student psychology records.</returns>
    public async Task<Pagination<GetStudentPsychologyDto>> GetAllAsync(StudentPsychologyFilter filter)
    {
        var query = filter.Query?.Trim();
        var specification = new SpecificationBuilder<StudentPsychology>()
            .Where(s =>
                (string.IsNullOrEmpty(query)
                    || s.StudentCode.Contains(query)
                    || (s.Student != null && s.Student.StudentName.Contains(query))
                )
                && (filter.UserId == null || s.UserId == filter.UserId)
            )
            .Include(s => s.Include(x => x.Student))
            .OrderByDescending(s => s.UpdatedAt ?? s.CreatedAt)
            .ApplyPaging(filter.PageNumber, filter.PageSize)
            .Build();
        var result = await unitOfWork.StudentPsychologyRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<GetStudentPsychologyDto>>(result);
    }

    /// <summary>
    /// Gets a student psychology record by ID.
    /// </summary>
    /// <param name="id">The ID of the student psychology record.</param>
    /// <returns>The student psychology record with the specified ID.</returns>
    public async Task<GetStudentPsychologyDto> GetByIdAsync(Guid id)
    {
        var specification = new SpecificationBuilder<StudentPsychology>()
            .Where(s => s.Id == id)
            .Include(s => s.Include(x => x.Student))
            .Build();
        var result = await unitOfWork.StudentPsychologyRepository.FirstOrDefaultAsync(specification) ??
                     throw new EntityNotFoundException(StudentPsychologyNotFoundMessage);
        return mapper.Map<GetStudentPsychologyDto>(result);
    }

    /// <summary>
    /// Gets a student psychology record by student code.
    /// </summary>
    /// <param name="studentCode">The student code of the student psychology record.</param>
    /// <returns>The student psychology record with the specified student code.</returns>
    public async Task<GetStudentPsychologyDto> GetByStudentCodeAsync(string studentCode)
    {
        var studentPsychology = await unitOfWork.StudentPsychologyRepository.GetByStudentCodeAsync(studentCode) ??
            throw new EntityNotFoundException(StudentPsychologyNotFoundMessage);
        return mapper.Map<GetStudentPsychologyDto>(studentPsychology);
    }

    /// <summary>
    /// Adds a new student psychology record.
    /// </summary>
    /// <param name="createStudentPsychologyDto">The data to create a new student psychology record.</param>
    /// <returns>The created student psychology record.</returns>
    public async Task<GetStudentPsychologyDto> AddAsync(CreateStudentPsychologyDto studentPsychologyDto)
    {
        if (await IsStudentPsychologyExisted(studentPsychologyDto.StudentCode))
        {
            throw new EntityAlreadyExistsException("Student psychology already exists.");
        }
        var currentUserId = ClaimsHelper.GetUserId(contextAccessor);
        await IsStudentExisted(studentPsychologyDto.StudentCode);
        var createStudentPsychology = mapper.Map<StudentPsychology>(studentPsychologyDto);
        //Hash the password
        createStudentPsychology.UserId = currentUserId;
        createStudentPsychology.AccessPassword = StringHelper.HashStudentPsychologyPassword(createStudentPsychology, createStudentPsychology.AccessPassword);
        createStudentPsychology = await unitOfWork.StudentPsychologyRepository.AddAsync(createStudentPsychology);
        //Log activity
        var userId = ClaimsHelper.GetUserId(contextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.AddStudentPsychologyDescription + $" [{createStudentPsychology.StudentCode}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetStudentPsychologyDto>(createStudentPsychology);
    }

    /// <summary>
    /// Checks if the student exists.
    /// </summary>
    /// <param name="studentCode">The student code to check.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    private async Task IsStudentExisted(string studentCode)
    {
        if (await unitOfWork.StudentRepository.GetByStudentCodeAsync(studentCode) == null)
        {
            throw new EntityNotFoundException("Student not found.");
        }
    }

    /// <summary>
    /// Checks if the student psychology record already exists.
    /// </summary>
    /// <param name="studentCode">The student code to check.</param>
    /// <returns>True if the student psychology record exists; otherwise, false.</returns>
    private async Task<bool> IsStudentPsychologyExisted(string studentCode)
    {
        return await unitOfWork.StudentPsychologyRepository.GetByStudentCodeAsync(studentCode) != null;
    }


    /// <summary>
    /// Verifies the student psychology record with the provided access password.
    /// </summary>
    /// <param name="data">The verification request data.</param>
    /// <returns>True if the verification is successful; otherwise, false.</returns>
    public async Task<VerifyPsychologyResponse> VerifyPsychologyAsync(VerifyPsychologyRequest data)
    {
        var studentPsychology = await unitOfWork.StudentPsychologyRepository.GetByIdAsync(data.Id) ?? throw new EntityNotFoundException("Student psychology not found.");
        if (!StringHelper.ValidateStudentPsychologyPassword(studentPsychology, data.AccessPassword))
        {
            throw new InvalidDataException("Invalid password.");
        }

        List<Claim> claims = [new("StudentCode", studentPsychology.StudentCode)];
        return new VerifyPsychologyResponse
        {
            AccessToken = TokenHelper.GenerateAccessToken(claims, jwtSetting)
        };
    }

    /// <summary>
    /// Updates the access password for a student psychology record.
    /// </summary>
    /// <param name="data">The update password request data.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task UpdatePasswordAsync(UpdateStudentPsychologyPasswordRequest data)
    {
        var studentPsychology = await unitOfWork.StudentPsychologyRepository.GetByIdAsync(data.Id) ??
            throw new EntityNotFoundException("Student psychology not found.");
        if (!StringHelper.ValidateStudentPsychologyPassword(studentPsychology, data.OldAccessPassword))
        {
            throw new InvalidDataException("Old password doesn't match.");
        }
        studentPsychology.AccessPassword = StringHelper.HashStudentPsychologyPassword(studentPsychology, data.NewAccessPassword);
        unitOfWork.StudentPsychologyRepository.Update(studentPsychology);
        //Log activity
        var userId = ClaimsHelper.GetUserId(contextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.UpdateStudentPsychologyPasswordDescription + $" [{studentPsychology.StudentCode}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task ForgetPasswordAsync(ForgetPasswordRequest data)
    {
        var studentPsychology = await unitOfWork.StudentPsychologyRepository.GetByIdAsync(data.Id) ??
            throw new EntityNotFoundException("Student psychology not found.");
        studentPsychology.AccessPassword = StringHelper.HashStudentPsychologyPassword(studentPsychology, data.Password);
        unitOfWork.StudentPsychologyRepository.Update(studentPsychology);
        //Log activity
        var userId = ClaimsHelper.GetUserId(contextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.ForgetStudentPsychologyPasswordDescription + $" [{studentPsychology.StudentCode}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(DeleteStudentPsychologyDto data)
    {
        var studentPsychology = await unitOfWork.StudentPsychologyRepository.GetByIdAsync(data.Id) ??
            throw new EntityNotFoundException("Student psychology not found.");
        await unitOfWork.StudentPsychologyRepository.DeleteAsync(studentPsychology);
        //Log activity
        var userId = ClaimsHelper.GetUserId(contextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.DeleteStudentPsychologyDescription + $" [{studentPsychology.StudentCode}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }
}
