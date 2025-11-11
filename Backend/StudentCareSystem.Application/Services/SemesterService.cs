using AutoMapper;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Semesters;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.ExternalServices;
using StudentCareSystem.Infrastructure.Specifications;

namespace StudentCareSystem.Application.Services;

public class SemesterService(ISemesterRepository semesterRepository, IMapper mapper, IFapService fapService, IUnitOfWork unitOfWork) : ISemesterService
{
    public async Task<SemesterDto?> GetCurrentSemesterAsync()
    {
        //Get current semester
        var semester = await semesterRepository.GetCurrentSemesterAsync()
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Current Semester"));
        return mapper.Map<SemesterDto>(semester);
    }

    public async Task<SemesterDto?> GetSemesterByNameAsync(string semesterName)
    {
        var specification = new SpecificationBuilder<Semester>().Where(s => s.SemesterName == semesterName).Build();
        var semester = await semesterRepository.FirstOrDefaultAsync(specification);
        return mapper.Map<SemesterDto>(semester);
    }

    public async Task<IEnumerable<SemesterDto>> GetAllSemestersAsync()
    {
        var specification = new SpecificationBuilder<Semester>()
            .OrderByDescending(s => s.StartDate)
            .Build();
        var semesters = await semesterRepository.GetAllAsync(specification);
        return mapper.Map<IEnumerable<SemesterDto>>(semesters);
    }

    public async Task ScanSemesterAsync()
    {
        var semestersFromDatabase = await semesterRepository.GetAllAsync();
        var semestersFromFap = await fapService.GetSemestersAsync();

        // Reset all current flags
        foreach (var s in semestersFromDatabase)
        {
            s.IsCurrentSemester = false;
        }

        foreach (var semester in semestersFromFap)
        {
            var existingSemester = semestersFromDatabase
                .FirstOrDefault(s => s.SemesterName == semester.SemesterName);

            if (existingSemester == null)
            {
                await semesterRepository.AddAsync(semester);
            }
            else
            {
                existingSemester.StartDate = semester.StartDate;
                existingSemester.EndDate = semester.EndDate;
                existingSemester.IsCurrentSemester = semester.IsCurrentSemester;
                semesterRepository.Update(existingSemester);
            }
        }

        // Check if any semester marked as current from FAP
        if (!semestersFromDatabase.Any(s => s.IsCurrentSemester))
        {
            // If none, set the most recent past semester as current
            var fallbackSemester = semestersFromDatabase
                .Where(s => s.EndDate < DateTime.UtcNow)
                .OrderByDescending(s => s.EndDate)
                .FirstOrDefault();

            if (fallbackSemester != null)
            {
                fallbackSemester.IsCurrentSemester = true;
                semesterRepository.Update(fallbackSemester);
            }
        }

        await unitOfWork.SaveChangesAsync();
    }

}
