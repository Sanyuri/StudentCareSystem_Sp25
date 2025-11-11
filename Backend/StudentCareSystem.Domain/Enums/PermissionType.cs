namespace StudentCareSystem.Domain.Enums;

public enum PermissionType
{
    // Permission for AbsenceRateBoundary
    ReadAbsenceRateBoundary,
    WriteAbsenceRateBoundary,
    // Permission for Activity
    ReadActivity,
    // Permission for Application Type
    ReadApplicationType,
    WriteApplicationType,
    // Permission for AppSettings
    ReadAppSetting,
    WriteAppSetting,
    // Permission for Email Sample
    ReadEmailSample,
    WriteEmailSample,
    // Permission for Email Log
    ReadEmailLog,
    // Permission for Note Type
    ReadNoteType,
    WriteNoteType,
    // Permission for Permission
    ReadPermission,
    // Permission for Psychological Note
    ReadPsychologicalNote,
    WritePsychologicalNote,
    // Permission for Role
    ReadRole,
    WriteRole,
    // Permission for Student Application
    ReadStudentApplication,
    WriteStudentApplication,
    // Permission for Student Attendance
    ReadStudentAttendance,
    //Permission for Student
    ReadStudent,
    // Permission for Student Defer
    ReadStudentDefer,
    // Permission for Student Note
    ReadStudentNote,
    WriteStudentNote,
    // Permission for Student Point
    ReadStudentPoint,
    // Permission for Student Psychology
    ReadStudentPsychology,
    WriteStudentPsychology,
    // Permission for Student Subject
    ReadStudentSubject,
    WriteStudentSubject,
    // Permission for User
    ReadUser,
    WriteUser,
    //Permission for Student Care
    ReadStudentCare,
    WriteStudentCare,
    // Permission for Student Care Type
    ReadProgressCriterionType,
    WriteProgressCriterionType,
    // Permission for Scan data
    ScanData,
    // Permission for Student Care Assignment
    WriteStudentCareAssignment,
    ReadStudentCareAssignment,
    OnlyForAdmin,
}
