using Microsoft.AspNetCore.Identity;

using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Commons.Utilities;

public static class StringHelper
{
    public static string Hash(User user, string pass)
    {
        PasswordHasher<User> passwordHasher = new PasswordHasher<User>();
        return passwordHasher.HashPassword(user, pass);
    }

    public static bool Verify(User user, string pass)
    {
        PasswordHasher<User> passwordHasher = new PasswordHasher<User>();
        return passwordHasher.VerifyHashedPassword(user, user.Password!, pass) == PasswordVerificationResult.Success;
    }

    /// <summary>
    /// Hash the student psychology password
    /// </summary>
    /// <param name="studentPsychology"></param>
    /// <param name="pass"></param>
    /// <returns></returns>
    public static string HashStudentPsychologyPassword(StudentPsychology studentPsychology, string pass)
    {
        PasswordHasher<StudentPsychology> passwordHasher = new PasswordHasher<StudentPsychology>();
        return passwordHasher.HashPassword(studentPsychology, pass);
    }

    /// <summary>
    /// Validate the student psychology password
    /// </summary>
    /// <param name="studentPsychology"></param>
    /// <param name="pass"></param>
    /// <returns></returns>
    public static bool ValidateStudentPsychologyPassword(StudentPsychology studentPsychology, string pass)
    {
        PasswordHasher<StudentPsychology> passwordHasher = new PasswordHasher<StudentPsychology>();
        return passwordHasher.VerifyHashedPassword(studentPsychology, studentPsychology.AccessPassword, pass) == PasswordVerificationResult.Success;
    }
}
