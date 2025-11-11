export enum PermissionType {
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
}

// Định nghĩa các nhóm permission dựa trên comment
export const PermissionGroups = {
  AbsenceRateBoundary: 'AbsenceRateBoundary',
  Activity: 'Activity',
  ApplicationType: 'ApplicationType',
  AppSetting: 'AppSetting',
  EmailSample: 'EmailSample',
  EmailLog: 'EmailLog',
  NoteType: 'NoteType',
  Permission: 'Permission',
  PsychologicalNote: 'PsychologicalNote',
  Role: 'Role',
  StudentApplication: 'StudentApplication',
  StudentAttendance: 'StudentAttendance',
  Student: 'Student',
  StudentDefer: 'StudentDefer',
  StudentNote: 'StudentNote',
  StudentPoint: 'StudentPoint',
  StudentPsychology: 'StudentPsychology',
  StudentSubject: 'StudentSubject',
  User: 'User',
  StudentCare: 'StudentCare',
  ProgressCriterionType: 'ProgressCriterionType',
  ScanData: 'ScanData',
  StudentCareAssignment: 'StudentCareAssignment',
}

// Hàm lấy nhóm từ permission type
export const getPermissionGroup = (permissionType: PermissionType | string): string => {
  // Ensure permissionName is a string
  const permissionName =
    typeof permissionType === 'string' ? permissionType : PermissionType[permissionType]

  if (typeof permissionName !== 'string') {
    return 'Other'
  }

  // Loại bỏ tiền tố Read/Write/Manage
  const nameWithoutPrefix = permissionName
    .replace(/^Read/, '')
    .replace(/^Write/, '')
    .replace(/^Manage/, '')

  // Tìm nhóm phù hợp
  for (const [groupKey, groupValue] of Object.entries(PermissionGroups)) {
    if (nameWithoutPrefix === groupKey) {
      return groupValue
    }
  }

  return 'Other'
}

// Get name of PermissionType
export const getPermissionTypeName = (permissionType: PermissionType): string => {
  return PermissionType[permissionType]
}
