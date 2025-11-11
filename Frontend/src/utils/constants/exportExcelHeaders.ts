import { HeaderFile } from '#types/Data/HeaderFile.js'

export const attendanceHeaders: HeaderFile[] = [
  { header: 'Student Name', key: 'student.studentName' },
  { header: 'Email', key: 'student.email' },
  { header: 'Student Code', key: 'student.studentCode' },
  { header: 'Student Class', key: 'className' },
  { header: 'Phone', key: 'student.mobilePhone' },
  { header: 'Major', key: 'student.major' },
  { header: 'Semester', key: 'semesterName' },
  { header: 'CurrentTerm', key: 'currentTermNo' },
  { header: 'Updated Period', key: 'updatedPeriod' },
  { header: 'Subject', key: 'subjectCode' },
  { header: 'Total Absences', key: 'totalAbsences' },
  { header: 'Total Slots', key: 'totalSlots' },
  { header: 'Absence Rate', key: 'absenceRate' },
  { header: 'Number of Emails', key: 'numberOfEmails' },
]

export const applicationHeaders: HeaderFile[] = [
  { header: 'Student Code', key: 'studentCode' },
  { header: 'Student Name', key: 'studentName' },
  { header: 'Student Email', key: 'studentEmail' },
  { header: 'Type of Document', key: 'applicationType.vietnameseName' },
  { header: 'Date Received', key: 'receivedDate' },
  { header: 'Returned Date', key: 'returnedDate' },
  { header: 'Document Type', key: 'status' },
]

export const failedStudentHeaders: HeaderFile[] = [
  { header: 'Student Code', key: 'studentCode' },
  { header: 'Student Name', key: 'studentName' },
  { header: 'Subject Code', key: 'subjectCode' },
  { header: 'Failed Time', key: 'failed' },
  { header: 'Passed Time', key: 'passed' },
]

export const deferStudentHeaders: HeaderFile[] = [
  { header: 'Student Code', key: 'studentCode' },
  { header: 'Student Name', key: 'student.studentName' },
  { header: 'Defer Type', key: 'studentDeferType' },
  { header: 'Description', key: 'description' },
  { header: 'Deferment Date', key: 'defermentDate' },
  { header: 'Deferred Semester', key: 'deferredSemesterName' },
  { header: 'Status', key: 'status' },
  { header: 'Current term', key: 'student.currentTermNo' },
  { header: 'Specialization', key: 'student.specialization' },
]

export const studentCareHeaders: HeaderFile[] = [
  { header: 'Student Code', key: 'student.studentCode' },
  { header: 'Student Name', key: 'student.studentName' },
  { header: 'Student Email', key: 'student.email' },
  { header: 'Specialization', key: 'student.specialization' },
  { header: 'Current term', key: 'student.currentTermNo' },
  { header: 'Rank', key: 'rank' },
  { header: 'Status', key: 'student.statusCode' },
  { header: 'Collaborating', key: 'isCollaborating' },
  { header: 'Progressing', key: 'isProgressing' },
  { header: 'Needs Care Next Term', key: 'needsCareNextTerm' },
  { header: 'Care Status', key: 'careStatus' },
  { header: 'Final Comment', key: 'finalComment' },
]

export const noteHeaders: HeaderFile[] = [
  {
    key: 'studentCode',
    header: 'Mã sinh viên',
  },
  {
    key: 'student.studentName',
    header: 'Tên sinh viên',
  },
  {
    key: 'noteType.vietnameseName',
    header: 'Loại ghi chú',
  },
  {
    key: 'content',
    header: 'Nội dung',
  },
  {
    key: 'channel',
    header: 'Kênh',
  },
  {
    key: 'processingTime',
    header: 'Thời gian xử lý',
  },
  {
    key: 'semesterName',
    header: 'Kì học',
  },
  {
    key: 'createdAt',
    header: 'Ngày tạo',
  },
  {
    key: 'createdBy',
    header: 'Người tạo',
  },
]
