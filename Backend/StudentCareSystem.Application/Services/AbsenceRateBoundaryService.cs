using AutoMapper;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.AbsenceRateBoundaries;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;

namespace StudentCareSystem.Application.Services;
public class AbsenceRateBoundaryService(
    IMapper mapper,
    IUnitOfWork unitOfWork
) : IAbsenceRateBoundaryService
{
    public async Task<GetAbsenceRateBoundaryDto> AddAsync(CreateAbsenceRateBoundaryDto absenceRateBoundaryDto)
    {
        var absenceRateBoundary = mapper.Map<AbsenceRateBoundary>(absenceRateBoundaryDto);
        await ValidateBoundaryAsync(absenceRateBoundary);
        await ValidateEmailSampleAsync(absenceRateBoundary.EmailSampleId);
        await unitOfWork.AbsenceRateBoundaryRepository.AddAsync(absenceRateBoundary);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetAbsenceRateBoundaryDto>(absenceRateBoundary);
    }

    public async Task DeleteAsync(Guid id)
    {
        var deleteAbsenceRateBoundary = await unitOfWork.AbsenceRateBoundaryRepository.GetByIdAsync(id);
        if (deleteAbsenceRateBoundary == null)
        {
            throw new InvalidOperationException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Absence rate boundary"));
        }
        unitOfWork.AbsenceRateBoundaryRepository.Delete(deleteAbsenceRateBoundary);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<GetAbsenceRateBoundaryDto>> GetAllAsync()
    {
        var specification = new SpecificationBuilder<AbsenceRateBoundary>()
            .Include(a => a.Include(x => x.EmailSample))
            .Build();
        var result = await unitOfWork.AbsenceRateBoundaryRepository.GetAllAsync(specification);
        return mapper.Map<IEnumerable<GetAbsenceRateBoundaryDto>>(result);
    }

    public async Task<GetAbsenceRateBoundaryDto> GetByIdAsync(Guid id)
    {
        var specification = new SpecificationBuilder<AbsenceRateBoundary>()
            .Include(a => a.Include(x => x.EmailSample))
            .Where(a => a.Id == id)
            .Build();
        var result = await unitOfWork.AbsenceRateBoundaryRepository.FirstOrDefaultAsync(specification);
        return mapper.Map<GetAbsenceRateBoundaryDto>(result);
    }

    public async Task UpdateAsync(UpdateAbsenceRateBoundaryDto absenceRateBoundaryDto)
    {
        var updatedAbsenceRateBoundary = mapper.Map<AbsenceRateBoundary>(absenceRateBoundaryDto);
        await ValidateBoundaryAsync(updatedAbsenceRateBoundary, updatedAbsenceRateBoundary.Id);
        await ValidateEmailSampleAsync(updatedAbsenceRateBoundary.EmailSampleId);
        unitOfWork.AbsenceRateBoundaryRepository.Update(updatedAbsenceRateBoundary);
        await unitOfWork.SaveChangesAsync();
    }

    private async Task ValidateBoundaryAsync(AbsenceRateBoundary boundary, Guid? id = null)
    {
        if (boundary.MinAbsenceRate >= boundary.MaxAbsenceRate)
        {
            throw new InvalidOperationException("Min absence rate must be less than max absence rate.");
        }

        var specification = new SpecificationBuilder<AbsenceRateBoundary>()
            .Where(a => (id == null || a.Id != id)
                        && !(boundary.MaxAbsenceRate <= a.MinAbsenceRate
                             || boundary.MinAbsenceRate >= a.MaxAbsenceRate))
            .Build();

        var overlappingBoundaries = await unitOfWork.AbsenceRateBoundaryRepository.GetAllAsync(specification);

        if (overlappingBoundaries.Any())
        {
            throw new InvalidOperationException("Boundary range overlaps with an existing range.");
        }
    }

    private async Task ValidateEmailSampleAsync(Guid emailSampleId)
    {
        var specification = new SpecificationBuilder<EmailSample>()
            .Where(a => a.Id == emailSampleId && a.EmailType == EmailType.AttendanceNotification)
            .Build();
        if (await unitOfWork.EmailSampleRepository.FirstOrDefaultAsync(specification) == null)
        {
            throw new InvalidOperationException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Email sample"));
        }
    }

}
