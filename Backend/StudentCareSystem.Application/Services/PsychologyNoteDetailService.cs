using AutoMapper;

using Microsoft.AspNetCore.Http;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.PsychologyNoteDetails;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;

namespace StudentCareSystem.Application.Services;

public class PsychologyNoteDetailService(
    IMapper mapper,
    IHttpContextAccessor httpContextAccessor,
    IUnitOfWork unitOfWork
) : IPsychologyNoteDetailService
{
    public async Task<GetPsychologyNoteDetailDto> GetByIdAsync(Guid id)
    {
        var (psychologyNoteDetail, _, _) = await GetEntitiesAsync(id);
        return mapper.Map<GetPsychologyNoteDetailDto>(psychologyNoteDetail);
    }

    public async Task<GetPsychologyNoteDetailDto> AddAsync(CreatePsychologyNoteDetailDto createPsychologyNoteDetailDto)
    {
        if (createPsychologyNoteDetailDto.PsychologyNoteId == null)
        {
            throw new EntityNotFoundException("Psychology note id not found.");
        }

        var psychologyNote = await unitOfWork.PsychologyNoteRepository.GetByIdAsync(createPsychologyNoteDetailDto.PsychologyNoteId)
            ?? throw new EntityNotFoundException("Psychology note not found.");

        var studentPsychology = await unitOfWork.StudentPsychologyRepository.GetByIdAsync(psychologyNote.StudentPsychologyId)
            ?? throw new EntityNotFoundException("Student psychology not found.");

        CheckStudentCode(studentPsychology.StudentCode);

        var psychologyNoteDetail = mapper.Map<PsychologyNoteDetail>(createPsychologyNoteDetailDto);
        await ValidPsychologyNoteDetail(psychologyNoteDetail);

        var result = await unitOfWork.PsychologyNoteDetailRepository.AddAsync(psychologyNoteDetail);
        await unitOfWork.SaveChangesAsync();

        return mapper.Map<GetPsychologyNoteDetailDto>(result);
    }

    public async Task<GetPsychologyNoteDetailDto> UpdateAsync(UpdatePsychologyNoteDetailDto updatePsychologyNoteDetailDto)
    {
        var (psychologyNoteDetail, _, studentPsychology) = await GetEntitiesAsync(updatePsychologyNoteDetailDto.Id);
        CheckStudentCode(studentPsychology.StudentCode);
        await ValidPsychologyNoteDetail(psychologyNoteDetail);
        psychologyNoteDetail.Content = updatePsychologyNoteDetailDto.Content;
        unitOfWork.PsychologyNoteDetailRepository.Update(psychologyNoteDetail);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetPsychologyNoteDetailDto>(psychologyNoteDetail);
    }

    public async Task DeleteAsync(Guid id)
    {
        var (_, _, studentPsychology) = await GetEntitiesAsync(id);
        CheckStudentCode(studentPsychology.StudentCode);
        await unitOfWork.PsychologyNoteDetailRepository.Delete(id);
        await unitOfWork.SaveChangesAsync();
    }

    // Unified validation method for both create and update operations
    private async Task ValidPsychologyNoteDetail(PsychologyNoteDetail psychologyNoteDetail)
    {
        // Check if the PsychologyNoteTypeId exists
        if ((await unitOfWork.PsychologyNoteTypeRepository.GetByIdAsync(psychologyNoteDetail.PsychologyNoteTypeId)) == null)
        {
            throw new EntityNotFoundException("Psychology note type not found.");
        }

        var specification = new SpecificationBuilder<PsychologyNoteDetail>()
            .Where(x => x.PsychologyNoteId == psychologyNoteDetail.PsychologyNoteId &&
                       x.PsychologyNoteTypeId == psychologyNoteDetail.PsychologyNoteTypeId &&
                       (psychologyNoteDetail.Id == Guid.Empty || x.Id != psychologyNoteDetail.Id))
            .Build();

        if (await unitOfWork.PsychologyNoteDetailRepository.AnyAsync(specification))
        {
            throw new EntityAlreadyExistsException("Psychology note detail type already exists.");
        }
    }

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

    private async Task<(PsychologyNoteDetail, PsychologyNote, StudentPsychology)> GetEntitiesAsync(Guid id)
    {
        var psychologyNoteDetail = await unitOfWork.PsychologyNoteDetailRepository.GetByIdAsync(id)
            ?? throw new EntityNotFoundException("Psychology note detail not found.");
        var psychologyNote = await unitOfWork.PsychologyNoteRepository.GetByIdAsync(psychologyNoteDetail.PsychologyNoteId)
            ?? throw new EntityNotFoundException("Psychology note not found.");
        var studentPsychology = await unitOfWork.StudentPsychologyRepository.GetByIdAsync(psychologyNote.StudentPsychologyId)
            ?? throw new EntityNotFoundException("Student psychology not found.");
        return (psychologyNoteDetail, psychologyNote, studentPsychology);
    }
}
