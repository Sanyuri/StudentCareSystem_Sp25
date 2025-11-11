using AutoMapper;

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Notes;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services;
public class StudentNoteService(
    IHttpContextAccessor httpContextAccessor,
    IMapper mapper,
    IUnitOfWork unitOfWork
) : IStudentNoteService
{
    public async Task<GetStudentNoteDto> AddAsync(CreateStudentNoteDto createStudentNoteDto)
    {
        var currentSemester = await unitOfWork.SemesterRepository.GetCurrentSemesterAsync() ??
                              throw new EntityNotFoundException("Current semester not found.");
        var note = mapper.Map<StudentNote>(createStudentNoteDto);
        await CheckNoteTypeExist(note.NoteTypeId);
        await CheckStudentExist(note.StudentCode);
        note.SemesterName = currentSemester.SemesterName;
        note = await unitOfWork.StudentNoteRepository.AddAsync(note);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            UserId = userId,
            ActivityType = ActivityType.Note,
            ActivityDescription = ActivityDescription.AddStudentNote
                .Replace("{NoteType}", $"[{note.NoteType?.VietnameseName}]")
                .Replace("{StudentCode}", $"[{note.StudentCode}]")
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetStudentNoteDto>(note);
    }

    public async Task<IEnumerable<GetStudentNoteDto>> ImportAsync(
        IEnumerable<ImportStudentNoteDto> createStudentNoteDtos)
    {
        var studentNotes = mapper.Map<IEnumerable<StudentNote>>(createStudentNoteDtos);
        var semesterNames = await unitOfWork.SemesterRepository.GetAllSemesterNamesAsync();
        var noteTypeIds = await unitOfWork.NoteTypeRepository.GetAllIdAsync();
        var studentCodes = await unitOfWork.StudentRepository.GetAllStudentCodeAsync();
        foreach (var note in studentNotes)
        {
            if (!semesterNames.Contains(note.SemesterName))
            {
                throw new EntityNotFoundException("Semester not found.");
            }

            if (!noteTypeIds.Contains(note.NoteTypeId))
            {
                throw new EntityNotFoundException("Note type not found.");
            }

            if (!studentCodes.Contains(note.StudentCode))
            {
                throw new EntityNotFoundException("Student not found.");
            }
        }

        await unitOfWork.StudentNoteRepository.AddBulkAsync(studentNotes);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            UserId = userId,
            ActivityType = ActivityType.Note,
            ActivityDescription = ActivityDescription.ImportStudentNote
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<IEnumerable<GetStudentNoteDto>>(studentNotes);
    }


    public async Task<Pagination<GetStudentNoteDto>> GetAllWithPaginationAsync(StudentNoteFilter filter)
    {
        var query = filter.Query?.Trim();
        var specification = new SpecificationBuilder<StudentNote>()
            .Include(a =>
                a.Include(x => x.Student)
                    .Include(x => x.NoteType)
            )
            .Where(a =>
                (string.IsNullOrEmpty(query)
                 || a.StudentCode.Contains(query)
                 || (a.Student != null && a.Student.StudentName.Contains(query))
                )
                && (filter.NoteTypeId == null || a.NoteTypeId == filter.NoteTypeId)
                && (filter.FromDate == null || a.CreatedAt.Date >= filter.FromDate.Value.Date)
                && (filter.SemesterName == null || filter.SemesterName == a.SemesterName)
                && (filter.ToDate == null || a.CreatedAt.Date <= filter.ToDate.Value.Date)
            )
            .OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
            .ApplyPaging(filter.PageNumber, filter.PageSize)
            .Build();

        var result = await unitOfWork.StudentNoteRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<GetStudentNoteDto>>(result);
    }

    public async Task<IEnumerable<GetStudentNoteDto>> GetByEntityIdAsync(Guid entityId)
    {
        var specification = new SpecificationBuilder<StudentNote>()
            .Where(a => a.EntityId == entityId)
            .Include(a => a.Include(a => a.Student))
            .OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
            .Build();
        var result = await unitOfWork.StudentNoteRepository.GetAllAsync(specification);
        return mapper.Map<IEnumerable<GetStudentNoteDto>>(result);
    }

    public async Task<IEnumerable<GetStudentNoteDto>> GetByStudentCodeAsync(string studentCode)
    {
        await CheckStudentExist(studentCode);
        var specification = new SpecificationBuilder<StudentNote>()
            .Where(a => a.StudentCode == studentCode)
            .Include(a => a.Include(a => a.Student))
            .Build();
        var result = await unitOfWork.StudentNoteRepository.GetAllAsync(specification);
        return mapper.Map<IEnumerable<GetStudentNoteDto>>(result);
    }

    public async Task<GetStudentNoteDto> GetByIdAsync(Guid id)
    {
        var studentNote = await GetStudentNoteByIdAsync(id);
        return mapper.Map<GetStudentNoteDto>(studentNote);
    }

    public async Task UpdateAsync(UpdateStudentNoteDto updateStudentNodeDto)
    {
        var studentNote = await unitOfWork.StudentNoteRepository.GetByIdAsync(updateStudentNodeDto.Id) ??
                          throw new EntityNotFoundException("Student note not found.");
        studentNote.Content = updateStudentNodeDto.Content;
        studentNote.Channel = updateStudentNodeDto.Channel ?? studentNote.Channel;
        studentNote.ProcessingTime = updateStudentNodeDto.ProcessingTime ?? studentNote.ProcessingTime;
        unitOfWork.StudentNoteRepository.Update(studentNote);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            UserId = userId,
            ActivityType = ActivityType.Note,
            ActivityDescription = ActivityDescription.UpdateStudentNote
                .Replace("{NoteType}", $"[{studentNote.NoteType?.VietnameseName}]")
                .Replace("{StudentCode}", $"[{studentNote.StudentCode}]")
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var studentNote = await GetStudentNoteByIdAsync(id);
        unitOfWork.StudentNoteRepository.Delete(studentNote);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            UserId = userId,
            ActivityType = ActivityType.Note,
            ActivityDescription = ActivityDescription.DeleteStudentNote
                .Replace("{NoteType}", $"[{studentNote.NoteType?.VietnameseName}]")
                .Replace("{StudentCode}", $"[{studentNote.StudentCode}]")
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    private async Task CheckNoteTypeExist(Guid noteTypeId)
    {
        if (await unitOfWork.NoteTypeRepository.GetByIdAsync(noteTypeId) == null)
        {
            throw new EntityNotFoundException("Note type not found.");
        }
    }

    private async Task CheckStudentExist(string studentCode)
    {
        var studentSpecification = new SpecificationBuilder<Student>()
            .Where(a => a.StudentCode == studentCode)
            .Build();
        if (!await unitOfWork.StudentRepository.AnyAsync(studentSpecification))
        {
            throw new EntityNotFoundException("Student not found.");
        }
    }

    private async Task<StudentNote> GetStudentNoteByIdAsync(Guid id)
    {
        var specification = new SpecificationBuilder<StudentNote>()
            .Where(a => a.Id == id)
            .Include(a => a.Include(a => a.Student).Include(a => a.NoteType))
            .UseSplitQueries()
            .Build();
        return await unitOfWork.StudentNoteRepository.FirstOrDefaultAsync(specification) ??
               throw new EntityNotFoundException("Student note not found.");
    }
}
