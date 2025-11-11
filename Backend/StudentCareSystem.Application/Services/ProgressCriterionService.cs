using AutoMapper;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.ProgressCriteria;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;


namespace StudentCareSystem.Application.Services;

public class ProgressCriterionService(
    IMapper _mapper,
    IUnitOfWork _unitOfWork
) : IProgressCriterionService
{
    public async Task<GetProgressCriterionDto> AddAsync(CreateProgressCriterionDto createProgressCriterionDto)
    {
        var studentNeedCare = await GetStudentNeedCare(createProgressCriterionDto.StudentNeedCareId);
        await CheckProgressCriterionType(createProgressCriterionDto.ProgressCriterionTypeId);
        if (studentNeedCare.ProgressCriteria.Any(x =>
                x.ProgressCriterionTypeId == createProgressCriterionDto.ProgressCriterionTypeId))
        {
            throw new EntityAlreadyExistsException(
                MessageDescription.ExceptionMessageDescription.EntityAlreadyExists("Progress Criterion"));
        }

        var progressCriterion = _mapper.Map<ProgressCriterion>(createProgressCriterionDto);
        await _unitOfWork.ProgressCriterionRepository.AddAsync(progressCriterion);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<GetProgressCriterionDto>(progressCriterion);
    }

    public async Task<IEnumerable<GetProgressCriterionDto>> GetByStudentNeedCareIdAsync(Guid studentNeedCareId)
    {
        var specification = new SpecificationBuilder<ProgressCriterion>()
            .Where(x => x.StudentNeedCareId == studentNeedCareId)
            .Build();
        var progressCriteria = await _unitOfWork.ProgressCriterionRepository.GetAllAsync(specification);
        return _mapper.Map<IEnumerable<GetProgressCriterionDto>>(progressCriteria);
    }

    public async Task UpdateAllByStudentNeedCareIdAsync(Guid studentNeedCareId,
        IEnumerable<UpdateProgressCriterionDto> updateProgressCriterionDtos)
    {
        await GetStudentNeedCare(studentNeedCareId);
        var progressCriteria = await GetProgressCriteria(studentNeedCareId);
        // Using dictornary to find which need to be added and which need to be updated
        var progressCriterionDict = progressCriteria.ToDictionary(x => x.ProgressCriterionTypeId);
        var progressCriteriaToAdd = new List<ProgressCriterion>();
        var progressCriteriaToUpdate = new List<ProgressCriterion>();
        foreach (var updateProgressCriterionDto in updateProgressCriterionDtos)
        {
            await CheckProgressCriterionType(updateProgressCriterionDto.ProgressCriterionTypeId);
            if (progressCriterionDict.TryGetValue(updateProgressCriterionDto.ProgressCriterionTypeId, out var progressCriterion))
            {
                if (progressCriterion.StudentNeedCareId != studentNeedCareId)
                {
                    throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Progress Criterion"));
                }

                progressCriterion.Score = updateProgressCriterionDto.Score;
                progressCriteriaToUpdate.Add(progressCriterion);

            }
            else
            {
                var newProgressCriterion = new ProgressCriterion
                {
                    StudentNeedCareId = studentNeedCareId,
                    ProgressCriterionTypeId = updateProgressCriterionDto.ProgressCriterionTypeId,
                    Score = updateProgressCriterionDto.Score,
                };
                progressCriteriaToAdd.Add(newProgressCriterion);
            }
        }
        if (progressCriteriaToAdd.Count > 0)
        {
            await _unitOfWork.ProgressCriterionRepository.AddRangeAsync(progressCriteriaToAdd);
        }
        if (progressCriteriaToUpdate.Count > 0)
        {
            _unitOfWork.ProgressCriterionRepository.UpdateRange(progressCriteriaToUpdate);
        }
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateAsync(UpdateProgressCriterionDto updateProgressCriterionDto)
    {
        var studentNeedCare = await GetStudentNeedCare(updateProgressCriterionDto.StudentNeedCareId);
        await CheckProgressCriterionType(updateProgressCriterionDto.ProgressCriterionTypeId);
        var progressCriterion = await _unitOfWork.ProgressCriterionRepository.GetByIdAsync(updateProgressCriterionDto.Id)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Progress Criterion"));
        if (progressCriterion.StudentNeedCareId != studentNeedCare.Id)
        {
            throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Progress Criterion"));
        }
        if (studentNeedCare.ProgressCriteria.Any(x => x.ProgressCriterionTypeId == updateProgressCriterionDto.ProgressCriterionTypeId && x.Id != progressCriterion.Id))
        {
            throw new EntityAlreadyExistsException(MessageDescription.ExceptionMessageDescription.EntityAlreadyExists("Progress Criterion"));
        }
        _mapper.Map(updateProgressCriterionDto, progressCriterion);
        _unitOfWork.ProgressCriterionRepository.Update(progressCriterion);
        await _unitOfWork.SaveChangesAsync();
    }


    private async Task<StudentNeedCare> GetStudentNeedCare(Guid studentNeedCareId)
    {
        var specification = new SpecificationBuilder<StudentNeedCare>()
            .Where(x => x.Id == studentNeedCareId)
            .Build();
        return await _unitOfWork.StudentNeedCareRepository.FirstOrDefaultAsync(specification)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Student Need Care"));
    }

    private async Task<List<ProgressCriterion>> GetProgressCriteria(Guid studentNeedCareId)
    {
        var specification = new SpecificationBuilder<ProgressCriterion>()
            .Where(x => x.StudentNeedCareId == studentNeedCareId)
            .Build();
        return [.. await _unitOfWork.ProgressCriterionRepository.GetAllAsync(specification)];
    }

    // Check if the type of progress criterion is valid
    private async Task CheckProgressCriterionType(Guid progressCriterionTypeId)
    {
        if (await _unitOfWork.ProgressCriterionTypeRepository.GetByIdAsync(progressCriterionTypeId) == null)
        {
            throw new EntityNotFoundException(
                MessageDescription.ExceptionMessageDescription.EntityNotFound("Progress Criterion Type"));
        }
    }
}
