# Student Care System API Documentation

This document provides a comprehensive reference to all API endpoints in the Student Care System backend. Each section covers a specific controller and its endpoints.

## Contents

- [Authentication](#authentication)
- [User Management](#user-management)
- [Student Information](#student-information)
- [Student Care](#student-care)
- [Attendance & Academic Records](#attendance--academic-records)
- [Email & Notifications](#email--notifications)
- [System Settings](#system-settings)
- [Dashboard & Reporting](#dashboard--reporting)

## Authentication

**Source:** [AuthController.cs](../Controllers/AuthController.cs)

**Description:** Handles user authentication flow including login, logout, token refresh, and special authentication operations.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| POST | `/api/Auth/refresh-token` | Refresh an authentication token | No | None |
| POST | `/api/Auth/signin-google` | Authenticate with Google | No | None |
| POST | `/api/Auth/logout` | Logout the current user | Yes | None |
| POST | `/api/Auth/sign-as-user` | Allow admin to sign in as another user | Yes | OnlyForAdmin |

### Requests & Responses

**POST `/api/Auth/refresh-token`**
```json
// Request
{
  "data": {
    "refreshToken": "string"
  }
}

// Response
{
  "status": 200,
  "message": "Success",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresAt": "datetime"
  }
}
```

**POST `/api/Auth/signin-google`**
```json
// Request
{
  "data": {
    "idToken": "string"
  }
}

// Response
{
  "status": 200,
  "message": "Success",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "guid",
      "email": "string",
      "fullName": "string",
      "role": "string"
    }
  }
}
```

## User Management

**Source:** [UsersController.cs](../Controllers/UsersController.cs)

**Description:** Manages user accounts, profiles, and user-related operations within the system.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/Users/me` | Get current user information | Yes | None |
| GET | `/api/Users/{id}` | Get user by ID | Yes | ReadUser |
| GET | `/api/Users` | List users with pagination | Yes | *Implied ReadUser* |
| POST | `/api/Users/normal-user` | Create new regular user | Yes | WriteUser |
| PUT | `/api/Users/normal-user/{id}` | Update existing user | Yes | WriteUser |
| DELETE | `/api/Users/normal-user/{id}` | Delete user | Yes | WriteUser |

**Source:** [RolesController.cs](../Controllers/RolesController.cs)

**Description:** Manages user roles and their definitions within the system's access control framework.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/Roles` | List all roles | Yes | ReadRole |
| GET | `/api/Roles/{id}` | Get role by ID | Yes | ReadRole |
| PUT | `/api/Roles/{id}` | Update existing role | Yes | WriteRole |

**Source:** [PermissionsController.cs](../Controllers/PermissionsController.cs)

**Description:** Manages system permissions and their assignments to roles.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/Permissions` | List all permissions | Yes | ReadPermission |
| GET | `/api/Permissions/{roleId}` | Get permissions for a specific role | Yes | ReadPermission |
| POST | `/api/Permissions/auto-set-permissions` | Automatically set default permissions for roles | Yes | OnlyForAdmin |

## Student Information

**Source:** [StudentsController.cs](../Controllers/StudentController.cs)

**Description:** Provides access to core student data and profiles.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/Students` | List students with pagination | Yes | ReadStudent |
| GET | `/api/Students/{studentCode}` | Get student by student code | Yes | ReadStudent |

**Source:** [StudentPsychologiesController.cs](../Controllers/StudentPsychologiesController.cs)

**Description:** Manages psychological profiles and services for students.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/StudentPsychologies` | List student psychology records | Yes | ReadStudentPsychology |
| GET | `/api/StudentPsychologies/{id}` | Get psychology record by ID | Yes | ReadStudentPsychology |
| GET | `/api/StudentPsychologies/student-code/{studentCode}` | Get psychology record by student code | Yes | ReadStudentPsychology |
| POST | `/api/StudentPsychologies` | Create new psychology record | Yes | WriteStudentPsychology |
| POST | `/api/StudentPsychologies/verify-psychology` | Verify a psychology record | Yes | WriteStudentPsychology |
| PUT | `/api/StudentPsychologies/change-password/{id}` | Update psychology record password | Yes | WriteStudentPsychology |
| PUT | `/api/StudentPsychologies/forget-password/{id}` | Handle forgotten password | Yes | WriteStudentPsychology |

## Student Care

**Source:** [StudentNeedCaresController.cs](../Controllers/StudentNeedCaresController.cs)

**Description:** Identifies and manages students who need special attention or care based on various criteria.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/StudentNeedCares` | List student care needs with pagination | Yes | ReadStudentCare |
| GET | `/api/StudentNeedCares/{id}` | Get student care need by ID | Yes | ReadStudentCare |
| GET | `/api/StudentNeedCares/care-status-count` | Get care status counts by semester | Yes | ReadStudentCare |
| GET | `/api/StudentNeedCares/scanned-list` | Get list of scanned students | Yes | ReadStudentCare |
| POST | `/api/StudentNeedCares` | Create new student care need | Yes | WriteStudentCare |
| POST | `/api/StudentNeedCares/scan` | Scan for students needing care | Yes | ScanData |
| POST | `/api/StudentNeedCares/confirm` | Confirm scanned list | Yes | WriteStudentCare |
| PUT | `/api/StudentNeedCares/{id}` | Update existing student care need | Yes | WriteStudentCare |
| PUT | `/api/StudentNeedCares/change-care-status/{id}` | Change student care status | Yes | WriteStudentCare |
| PUT | `/api/StudentNeedCares/final-evaluate/{id}` | Record final care evaluation | Yes | WriteStudentCare |
| DELETE | `/api/StudentNeedCares/{id}` | Delete student care need | Yes | WriteStudentCare |
| DELETE | `/api/StudentNeedCares/scanned-list/{studentCodes}` | Remove students from scanned list | Yes | WriteStudentCare |

**Request Example - Change Care Status:**
```json
{
  "data": {
    "id": "guid",
    "careStatus": 2,
    "careNote": "Student has shown improvement"
  }
}
```

**Source:** [StudentCareAssignmentsController.cs](../Controllers/StudentCareAssignmentsController.cs)

**Description:** Handles the assignment of students who need care to appropriate staff members or counselors.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/StudentCareAssignments/user-assigned-count` | Get count of assignments by user | Yes | ReadStudentCareAssignment |
| POST | `/api/StudentCareAssignments` | Create new student care assignment | Yes | WriteStudentCareAssignment |
| POST | `/api/StudentCareAssignments/auto-assign` | Automatically assign students to care providers | Yes | WriteStudentCareAssignment |
| POST | `/api/StudentCareAssignments/auto-assign-with-percentage` | Assign students based on percentages | Yes | WriteStudentCareAssignment |
| PUT | `/api/StudentCareAssignments` | Update existing student care assignment | Yes | WriteStudentCareAssignment |

## Psychology Notes

**Source:** [PsychologyNotesController.cs](../Controllers/PsychologyNotesController.cs)

**Description:** Manages psychology counseling session notes and related documentation for students.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/PsychologyNotes/student/{studentPsychologyId}` | Get psychology notes for a student | Yes | ReadPsychologicalNote + StudentPsychology |
| POST | `/api/PsychologyNotes` | Create new psychology note | Yes | WritePsychologicalNote + StudentPsychology |
| PUT | `/api/PsychologyNotes/{id}` | Update existing psychology note | Yes | WritePsychologicalNote + StudentPsychology |
| PUT | `/api/PsychologyNotes/{id}/drive-url` | Update drive URL for a psychology note | Yes | WritePsychologicalNote + StudentPsychology |

**Source:** [PsychologyNoteDetailsController.cs](../Controllers/PsychologyNoteDetailsController.cs)

**Description:** Manages the detailed contents of psychology notes including categorization and specific observations.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/PsychologyNoteDetails/{id}` | Get psychology note detail by ID | Yes | ReadPsychologicalNote + StudentPsychology |
| POST | `/api/PsychologyNoteDetails` | Create new psychology note detail | Yes | WritePsychologicalNote + StudentPsychology |
| PUT | `/api/PsychologyNoteDetails/{id}` | Update existing psychology note detail | Yes | WritePsychologicalNote + StudentPsychology |
| DELETE | `/api/PsychologyNoteDetails/{id}` | Delete psychology note detail | Yes | WritePsychologicalNote + StudentPsychology |

## Progress Criteria

**Source:** [ProgressCriteriaController.cs](../Controllers/ProgressCriteriaController.cs)

**Description:** Manages the criteria used to track and evaluate student progress in care programs.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/ProgressCriteria/by-student-need-care/{studentNeedCareId}` | Get progress criteria for a student | Yes | ReadStudentCare |
| POST | `/api/ProgressCriteria` | Create new progress criterion | Yes | WriteStudentCare |
| PUT | `/api/ProgressCriteria` | Update existing progress criterion | Yes | WriteStudentCare |
| PUT | `/api/ProgressCriteria/update-all/{studentNeedCareId}` | Update all progress criteria for a student | Yes | WriteStudentCare |

**Source:** [ProgressCriterionTypesController.cs](../Controllers/ProgressCriterionTypesController.cs)

**Description:** Manages the types of criteria that can be used to evaluate student progress.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/ProgressCriterionTypes` | List all progress criterion types | Yes | ReadProgressCriterionType |
| GET | `/api/ProgressCriterionTypes/{id}` | Get progress criterion type by ID | Yes | ReadProgressCriterionType |
| POST | `/api/ProgressCriterionTypes` | Create new progress criterion type | Yes | WriteProgressCriterionType |
| PUT | `/api/ProgressCriterionTypes/{id}` | Update existing progress criterion type | Yes | WriteProgressCriterionType |
| DELETE | `/api/ProgressCriterionTypes/{id}` | Delete progress criterion type | Yes | WriteProgressCriterionType |

## Attendance & Academic Records

**Source:** [StudentAttendancesController.cs](../Controllers/StudentAttendancesController.cs)

**Description:** Tracks and manages student attendance records, including notifications for absence patterns.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/StudentAttendances` | List student attendances with pagination | Yes | ReadStudentAttendance |
| GET | `/api/StudentAttendances/student-attendance/{studentCode}` | Get attendance for specific student | Yes | ReadStudentAttendance |
| GET | `/api/StudentAttendances/notifications/date` | Get attendance notifications by date | Yes | ReadStudentAttendance |
| GET | `/api/StudentAttendances/notifications/semester` | Get attendance notifications by semester | Yes | ReadStudentAttendance |
| GET | `/api/StudentAttendances/last-updated` | Get recently updated attendance records | Yes | ReadStudentAttendance |
| GET | `/api/StudentAttendances/last-updated-date` | Get last attendance update date | Yes | ReadStudentAttendance |
| POST | `/api/StudentAttendances/scan` | Trigger manual attendance scan | Yes | ScanData |

**Source:** [StudentPointsController.cs](../Controllers/StudentPointsController.cs)

**Description:** Manages student academic performance metrics and grade points across courses.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/StudentPoints` | List student points with pagination | Yes | ReadStudentPoint |
| GET | `/api/StudentPoints/failed-subject/{studentCode}` | Get failed subjects for student | Yes | ReadStudentPoint |
| GET | `/api/StudentPoints/student-point/{studentCode}` | Get points for student across semesters | Yes | ReadStudentPoint |
| GET | `/api/StudentPoints/last-updated-date` | Get last point update date | Yes | ReadStudentPoint |

**Source:** [StudentDefersController.cs](../Controllers/StudentDefersController.cs)

**Description:** Manages student course and semester deferral requests and records.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/StudentDefers` | List student deferrals with pagination | Yes | ReadStudentDefer |
| GET | `/api/StudentDefers/last-updated-date` | Get last deferral update date | Yes | ReadStudentDefer |
| POST | `/api/StudentDefers/scan` | Trigger manual defer scan | Yes | ScanData |

**Source:** [SubjectsController.cs](../Controllers/SubjectsController.cs)

**Description:** Manages academic subjects, their configurations, and attendance policies.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/Subjects` | List subjects with pagination | Yes | ReadStudentSubject |
| GET | `/api/Subjects/{id}` | Get subject by ID | Yes | ReadStudentSubject |
| PUT | `/api/Subjects/attendance-free` | Update attendance-free subjects | Yes | WriteStudentSubject |
| PUT | `/api/Subjects/{id}` | Update existing subject | Yes | WriteStudentSubject |

## Email & Notifications

**Source:** [EmailController.cs](../Controllers/EmailController.cs)

**Description:** Handles sending of various notification emails to students and staff.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| POST | `/api/Email/Send-Deferral-Email` | Send deferral notification emails | Yes | None |
| POST | `/api/Email/Send-Attendance-Email` | Send attendance notification emails | Yes | None |
| POST | `/api/Email/Send-Failed-Subject-Email` | Send failed subject notification emails | Yes | None |

**Source:** [EmailSubSamplesController.cs](../Controllers/EmailSubSamplesController.cs)

**Description:** Manages email template components that can be used to construct notifications.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/EmailSubSamples` | List email templates with pagination | Yes | ReadEmailSample |
| GET | `/api/EmailSubSamples/{id}` | Get email template by ID | Yes | ReadEmailSample |
| POST | `/api/EmailSubSamples` | Create new email template | Yes | WriteEmailSample |
| PUT | `/api/EmailSubSamples/{id}` | Update existing email template | Yes | WriteEmailSample |
| DELETE | `/api/EmailSubSamples/{id}` | Delete email template | Yes | WriteEmailSample |

**Source:** [EmailLogsController.cs](../Controllers/EmailLogsController.cs)

**Description:** Tracks and provides access to system-wide email communication logs.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/EmailLogs` | List email logs with pagination | Yes | ReadEmailLog |
| GET | `/api/EmailLogs/{id}` | Get email log by ID | Yes | ReadEmailLog |

**Source:** [UserEmailLogsController.cs](../Controllers/UserEmailLogsController.cs)

**Description:** Manages email logs specific to individual users.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/UserEmailLogs` | List user email logs with pagination | Yes | ReadEmailLog |
| GET | `/api/UserEmailLogs/{id}` | Get user email log by ID | Yes | ReadEmailLog |

## System Settings

**Source:** [AppSettingsController.cs](../Controllers/AppSettingsController.cs)

**Description:** Manages system-wide configuration settings and parameters.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/AppSettings` | List all system settings | No | None |
| GET | `/api/AppSettings/{id}` | Get setting by ID | Yes | ReadAppSetting |
| GET | `/api/AppSettings/key/{key}` | Get setting by key | Yes | ReadAppSetting |
| POST | `/api/AppSettings` | Create new setting | Yes | WriteAppSetting |
| PUT | `/api/AppSettings/{id}` | Update existing setting | Yes | WriteAppSetting |
| DELETE | `/api/AppSettings/{id}` | Delete setting | Yes | WriteAppSetting |

**Source:** [MfaController.cs](../Controllers/MfaController.cs)

**Description:** Handles multi-factor authentication operations for enhanced security.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| POST | `/api/Mfa/enable` | Enable multi-factor authentication | Yes | None |
| POST | `/api/Mfa/disable` | Disable multi-factor authentication | Yes | None |
| POST | `/api/Mfa/verify` | Verify MFA code | Yes | None |

**Source:** [SemestersController.cs](../Controllers/SemestersController.cs)

**Description:** Provides information about academic semesters and periods.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/Semesters/semester` | Get current semester | Yes | None |
| GET | `/api/Semesters/semesters/all` | List all semesters | Yes | None |

**Source:** [TenantsController.cs](../Controllers/TenantsController.cs)

**Description:** Manages tenant information in multi-tenant deployments of the system.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/Tenants` | List all tenants in the system | No | None |

## Dashboard & Reporting

**Source:** [DashboardsController.cs](../Controllers/DashboardsController.cs)

**Description:** Provides aggregate statistics and reports for system dashboards and analytics.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/Dashboards/student-total-reminder` | Get total student reminder statistics | Yes | None |
| GET | `/api/Dashboards/student-attendance` | Get student attendance statistics | Yes | None |
| GET | `/api/Dashboards/student-deferment` | Get student deferment statistics | Yes | None |
| GET | `/api/Dashboards/student-failed-course` | Get student failed course statistics | Yes | None |
| GET | `/api/Dashboards/total-application` | Get total application statistics | Yes | None |
| GET | `/api/Dashboards/application-by-time` | Get application statistics by time period | Yes | None |
| GET | `/api/Dashboards/student-reminder-by-time` | Get student reminder statistics by time period | Yes | None |
| GET | `/api/Dashboards/student-cared` | Get statistics on students receiving care | Yes | None |
| GET | `/api/Dashboards/email-log-by-time` | Get email log statistics by time period | Yes | None |

**Source:** [ActivitiesController.cs](../Controllers/ActivitiesController.cs)

**Description:** Tracks and logs user activities within the system for audit and monitoring.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/Activities` | Retrieve user activity logs with pagination and filtering | Yes | ReadActivity |

## Applications and Notes

**Source:** [StudentApplicationsController.cs](../Controllers/StudentApplicationsController.cs)

**Description:** Manages applications submitted by students for various requests and services.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/StudentApplications` | List student applications with pagination | Yes | ReadStudentApplication |
| GET | `/api/StudentApplications/{id}` | Get student application by ID | Yes | ReadStudentApplication |
| POST | `/api/StudentApplications` | Create new student application | Yes | WriteStudentApplication |
| DELETE | `/api/StudentApplications/{id}` | Delete student application | Yes | WriteStudentApplication |

**Source:** [ApplicationTypesController.cs](../Controllers/ApplicationTypesController.cs)

**Description:** Manages the various types of applications that can be submitted by students.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/ApplicationTypes` | List all application types | Yes | ReadApplicationType |
| GET | `/api/ApplicationTypes/all` | Get paginated application types | Yes | ReadApplicationType |
| GET | `/api/ApplicationTypes/{id}` | Get application type by ID | Yes | ReadApplicationType |
| POST | `/api/ApplicationTypes` | Create new application type | Yes | WriteApplicationType |
| PUT | `/api/ApplicationTypes/{id}` | Update existing application type | Yes | WriteApplicationType |
| DELETE | `/api/ApplicationTypes/{id}` | Delete application type | Yes | WriteApplicationType |

**Source:** [StudentNotesController.cs](../Controllers/StudentNotesController.cs)

**Description:** Manages general notes and annotations related to students and their academic journey.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/StudentNotes` | List student notes with pagination | Yes | ReadStudentNote |
| GET | `/api/StudentNotes/entity/{entityId}` | Get notes for specific entity | Yes | ReadStudentNote |
| GET | `/api/StudentNotes/student/{studentCode}` | Get notes for specific student | Yes | ReadStudentNote |
| GET | `/api/StudentNotes/{id}` | Get note by ID | Yes | ReadStudentNote |
| POST | `/api/StudentNotes` | Create new student note | Yes | WriteStudentNote |
| POST | `/api/StudentNotes/import` | Import student notes in bulk | Yes | WriteStudentNote |
| PUT | `/api/StudentNotes/{id}` | Update existing student note | Yes | WriteStudentNote |
| DELETE | `/api/StudentNotes/{id}` | Delete student note | Yes | WriteStudentNote |

**Source:** [NoteTypesController.cs](../Controllers/NoteTypesController.cs)

**Description:** Manages the categories and types of notes that can be created in the system.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| GET | `/api/NoteTypes` | List all note types | Yes | ReadNoteType |
| GET | `/api/NoteTypes/{id}` | Get note type by ID | Yes | ReadNoteType |
| GET | `/api/NoteTypes/default/{defaultNoteType}` | Get note type by default type | Yes | ReadNoteType |
| POST | `/api/NoteTypes` | Create new note type | Yes | WriteNoteType |
| PUT | `/api/NoteTypes/{id}` | Update existing note type | Yes | WriteNoteType |
| DELETE | `/api/NoteTypes/{id}` | Delete note type | Yes | WriteNoteType |

## Testing

**Source:** [TestController.cs](../Controllers/TestController.cs)

**Description:** Provides endpoints for testing system functionality and AI integration.

| Method | Endpoint | Description | Auth Required | Permission |
|--------|----------|-------------|--------------|------------|
| POST | `/api/Test/test-ai` | Test AI service functionality | No | None |
| GET | `/api/Test/test-get-student-need-care` | Test student care need retrieval | No | None |
