using AutoMapper;

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.PsychologyNotes;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;


namespace StudentCareSystem.Application.Services;

public class PsychologyNoteService(
    IMapper mapper,
    IHttpContextAccessor httpContextAccessor,
    IUnitOfWork unitOfWork
) : IPsychologyNoteService
{
    public async Task<IEnumerable<GetPsychologyNoteDto>> GetByStudentPsychologyIdAsync(Guid studentPsychologyId)
    {
        var studentPsychology = await GetStudentPsychologyById(studentPsychologyId);
        CheckStudentCode(studentPsychology.StudentCode);
        var specification = new SpecificationBuilder<PsychologyNote>()
            .Where(p => p.StudentPsychologyId == studentPsychologyId)
            .Include(p =>
                p.Include(n => n.PsychologyNoteDetails)
                .ThenInclude(d => d.PsychologyNoteType)
            )
            .OrderByDescending(p => p.UpdatedAt ?? p.CreatedAt)
            .UseSplitQueries()
            .Build();
        var psychologyNotes = await unitOfWork.PsychologyNoteRepository.GetAllAsync(specification);
        return mapper.Map<IEnumerable<GetPsychologyNoteDto>>(psychologyNotes);
    }

    public async Task<GetPsychologyNoteDto> GetByIdAsync(Guid id)
    {
        var psychologyNote = await unitOfWork.PsychologyNoteRepository.GetByIdAsync(id)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Psychology Note"));
        return mapper.Map<GetPsychologyNoteDto>(psychologyNote);
    }

    public async Task UpdateAsync(UpdatePsychologyNoteDto psychologyNoteDto)
    {
        var psychologyNote = await unitOfWork.PsychologyNoteRepository.GetByIdAsync(psychologyNoteDto.Id)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Psychology Note"));
        var studentPsychology = await GetStudentPsychologyById(psychologyNote.StudentPsychologyId);
        CheckStudentCode(studentPsychology.StudentCode);
        var psychologyNoteDetails = mapper.Map<IEnumerable<PsychologyNoteDetail>>(psychologyNoteDto.PsychologyNoteDetails);
        await CheckPsychologyNote(psychologyNoteDetails);
        foreach (var detail in psychologyNoteDetails)
        {
            var existingDetail = psychologyNote.PsychologyNoteDetails
                .FirstOrDefault(d => d.PsychologyNoteTypeId == detail.PsychologyNoteTypeId);
            if (existingDetail != null)
            {
                existingDetail.Content = detail.Content;
                existingDetail.PsychologyNoteTypeId = detail.PsychologyNoteTypeId;
            }
            else
            {
                psychologyNote.PsychologyNoteDetails.Add(detail);
            }
        }
        // Update the subject before logging activity
        psychologyNote.Subject = psychologyNoteDto.Subject ?? string.Empty;
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.UpdatePsychologyNoteDescription + $" [{psychologyNote.Subject}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task<GetPsychologyNoteDto> AddAsync(CreatePsychologyNoteDto psychologyNoteDto)
    {
        var psychologyNote = mapper.Map<PsychologyNote>(psychologyNoteDto);
        var studentPsychology = await GetStudentPsychologyById(psychologyNote.StudentPsychologyId);
        CheckStudentCode(studentPsychology.StudentCode);
        await CheckPsychologyNote(psychologyNote.PsychologyNoteDetails);
        var currentSemester = await unitOfWork.SemesterRepository.GetCurrentSemesterAsync()
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Current Semester"));
        psychologyNote.SemesterName = currentSemester.SemesterName;
        psychologyNote = await unitOfWork.PsychologyNoteRepository.AddAsync(psychologyNote);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.AddPsychologyNoteDescription + $" [{psychologyNote.Subject}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetPsychologyNoteDto>(psychologyNote);
    }

    public async Task<StudentPsychology> GetStudentPsychologyById(Guid studentPsychologyId)
    {
        return await unitOfWork.StudentPsychologyRepository.GetByIdAsync(studentPsychologyId)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Student Psychology"));
    }

    private async Task CheckPsychologyNote(IEnumerable<PsychologyNoteDetail> psychologyNoteDetails)
    {
        var psychologyNoteTypes = await unitOfWork.PsychologyNoteTypeRepository.GetAllAsync();
        var invalidPsychologyNoteDetails = psychologyNoteDetails
            .Where(detail => psychologyNoteTypes.All(type => type.Id != detail.PsychologyNoteTypeId));
        // check invalid psychology note type
        if (invalidPsychologyNoteDetails.Any())
        {
            throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Psychology Note Type"));
        }
        // check duplicate psychology note type
        var duplicatePsychologyNoteTypes = psychologyNoteDetails
            .GroupBy(detail => detail.PsychologyNoteTypeId)
            .Where(group => group.Count() > 1)
            .Select(group => group.Key);
        if (duplicatePsychologyNoteTypes.Any())
        {
            throw new EntityAlreadyExistsException(MessageDescription.ExceptionMessageDescription.EntityAlreadyExists("Duplicate Psychology Note Type"));
        }
    }

    // Check the student code in httpContext item match with the student code in the psychology note

    private void CheckStudentCode(string studentCode)
    {
        var context = httpContextAccessor.HttpContext;
        if (context == null || !context.Items.ContainsKey("StudentCode"))
        {
            throw new ForbiddenException(InvalidTokenDescription.InvalidToken);
        }

        var currentStudentCode = context.Items["StudentCode"]?.ToString();
        if (currentStudentCode != studentCode)
        {
            throw new ForbiddenException(InvalidTokenDescription.InvalidToken);
        }
    }

    public async Task UpdateDriveUrlAsync(Guid id, string driveUrl)
    {
        var psychologyNote = await unitOfWork.PsychologyNoteRepository.GetByIdAsync(id)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Psychology Note"));
        psychologyNote.DriveURL = driveUrl;
        unitOfWork.PsychologyNoteRepository.Update(psychologyNote);
        await unitOfWork.SaveChangesAsync();
    }
}
