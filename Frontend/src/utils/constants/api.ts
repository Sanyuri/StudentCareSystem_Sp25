const BASE_URL = '/_proxy/api'
const BASE_CHAT_URL = `/_chat`
const BASE_GOOGLE_SCRIPT_URL = `/_google-script`
const AUTH_BASE_URL = `${BASE_URL}/Auth`
const ATTENDANCE_BASE_URL = `${BASE_URL}/studentAttendances`
const APPLICATION_BASE_URL = `${BASE_URL}/studentapplications`
const NOTE_BASE_URL = `${BASE_URL}/studentNotes`
const PSYCHOLOGY_BASE_URL = `${BASE_URL}/PsychologyNotes`
const STUDENT_PSYCHOLOGY_BASE_URL = `${BASE_URL}/StudentPsychologies`
const SUBJECT_BASE_URL = `${BASE_URL}/Subjects`
const STATISTIC_BASE_URL = `${BASE_URL}/studentAttendances/statistics`

// Auth api
export const GET_CSRF_TOKEN_URL = `${BASE_URL}/Csrf/token`
export const LOGIN_URL = `/login`
export const SIGN_IN_GOOGLE_URL = `${AUTH_BASE_URL}/signin-google`
export const LOGOUT_URL = `${AUTH_BASE_URL}/logout`
export const REFRESH_TOKEN_URL = `${AUTH_BASE_URL}/refresh-token`
export const ADD_REFRESH_TOKEN_URL = `/_auth/add-token`
export const GET_REFRESH_TOKEN_URL = `/_auth/get-refresh-token`
export const REMOVE_REFRESH_TOKEN_URL = `/_auth/remove-token`
export const SIGN_AS_URL = `${AUTH_BASE_URL}/sign-as-user`

// Attendance rate api
export const ATTENDANCE_RATE_BOUNDARY_URL = `${BASE_URL}/absenceRateBoundaries`
export const ATTENDANCE_HISTORY_URL = `${BASE_URL}/attendanceHistories/student-attendance`

// Activity api
export const LIST_URL = `${BASE_URL}/activities`

// Application api
export const STUDENT_APPLICATION_URL = APPLICATION_BASE_URL
export const ADD_STUDENT_APPLICATION_URL = `${BASE_URL}/studentApplication`

// Application type api
export const GET_APPLICATION_TYPE_LIST_URL = `${BASE_URL}/applicationTypes`
export const APPLICATION_TYPE_LIST_ALL_URL = `${BASE_URL}/applicationTypes/all`

// Attendance api
export const ATTENDANCE_LIST_URL = ATTENDANCE_BASE_URL
export const ATTENDANCE_DATE_URL = `${ATTENDANCE_BASE_URL}/notifications/date`
export const ATTENDANCE_SEMESTER_URL = `${ATTENDANCE_BASE_URL}/notifications/semester`
export const ATTENDANCE_LAST_UPDATE_URL = `${ATTENDANCE_BASE_URL}/last-updated-date`
export const ATTENDANCE_SCAN_URL = `${ATTENDANCE_BASE_URL}/scan`
export const ATTENDANCE_DETAIL_URL = `${ATTENDANCE_BASE_URL}/student-attendance`

// Defer api
export const GET_ALL_STUDENT_DEFER_URL = `${BASE_URL}/StudentDefers`
export const SCAN_STUDENT_DEFER_URL = `${GET_ALL_STUDENT_DEFER_URL}/scan`

// Email template api
export const EMAIL_TEMPLATE_LIST_URL = `${BASE_URL}/emailSamples`

// Sub email template api
export const SUB_EMAIL_TEMPLATE_URL = `${BASE_URL}/emailSubSamples`

// Email api
export const EMAIL_DEFER_URL = `${BASE_URL}/email/Send-Deferral-Email`
export const EMAIL_FAILED_URL = `${BASE_URL}/email/Send-Failed-Subject-Email`

// Account api
export const LIST_ACCOUNTS_URL = `${BASE_URL}/users`

// Major api
export const GET_ALL_MAJOR_URL = `${BASE_URL}/majors`

// Note api
export const GET_ALL_NOTE_SCREEN_URL = `${NOTE_BASE_URL}/entity`
export const NOTE_URL = NOTE_BASE_URL
export const NOTE_STUDENT_URL = `${NOTE_BASE_URL}/student`
export const NOTE_IMPORT_URL = `${NOTE_BASE_URL}/import`

// Note type api
export const NOTE_TYPE_URL = `${BASE_URL}/noteTypes`

// Notification api
export const SEND_NOTIFY_ALL_URL = `${BASE_URL}/notify/all`
export const SEND_NOTIFY_URL = `${BASE_URL}/notify`

// Permission api
export const GET_ALL_PERMISSION_URL = `${BASE_URL}/permissions`
export const AUTO_SET_PERMISSION_URL = `${GET_ALL_PERMISSION_URL}/auto-set-permissions`

// Psychologist api
export const PSYCHOLOGY_NOTE_URL = `${PSYCHOLOGY_BASE_URL}/student`
export const PSYCHOLOGY_NOTE_BASE_URL = PSYCHOLOGY_BASE_URL

// Psychology note type api
export const PSYCHOLOGY_NOTE_TYPE_URL = `${BASE_URL}/psychologyNoteTypes`

// Psychology detail note type api
export const PSYCHOLOGY_NOTE_DETAIL_URL = `${BASE_URL}/PsychologyNoteDetails`

// Role api
export const GET_ALL_ROLES_URL = `${BASE_URL}/roles`

// Semester api
export const GET_ALL_SEMESTER_URL = `${BASE_URL}/semesters/semesters/all`
export const GET_CURRENT_SEMESTER_URL = `${BASE_URL}/semesters/semester`

// Student failed course api
export const GET_ALL_STUDENT_FAILED_COURSE_URL = `${BASE_URL}/StudentPoints`
export const GET_ALL_STUDENT_FAILED_COURSE_DETAIL_URL = `${BASE_URL}/StudentPoints/failed-subject`
export const STUDENT_FAILED_COURSE_EXPORT_URL = `${BASE_URL}/StudentPoints/export`

// Student point api
export const STUDENT_POINT_URL = `${BASE_URL}/studentPoints/student-point`

// Student psychology api
export const STUDENT_PSYCHOLOGY_URL = STUDENT_PSYCHOLOGY_BASE_URL
export const STUDENT_PSYCHOLOGY_VERIFY_URL = `${STUDENT_PSYCHOLOGY_BASE_URL}/verify-psychology`
export const STUDENT_PSYCHOLOGY_CHANGE_PASSWORD = `${STUDENT_PSYCHOLOGY_BASE_URL}/change-password`
export const STUDENT_PSYCHOLOGY_BY_STUDENT_CODE_URL = `${STUDENT_PSYCHOLOGY_BASE_URL}/student-code`

// Student api
export const GET_ALL_STUDENT_URL = `${BASE_URL}/students`
export const STUDENT_API_URL = `${BASE_URL}/students`

// Subject api
export const GET_SUBJECT_LIST_URL = `${SUBJECT_BASE_URL}?TakeAttendance=false`
export const SUBJECT_ADD_LIST_URL = `${SUBJECT_BASE_URL}/attendance-free`
export const SUBJECT_LIST_URL = SUBJECT_BASE_URL
export const SUBJECT_LIST_ADD_URL = `${SUBJECT_BASE_URL}?TakeAttendance=true`

// Tenant api
export const GET_ALL_TENANT_URL = `${BASE_URL}/tenants`

// Test api
export const TEST_URL = `${BASE_URL}/Email/test`

// User api
export const CURRENT_USER_URL = `${BASE_URL}/users/me`
export const USER_API_URL = `${BASE_URL}/users`
export const NORMAL_USER_URL = `${BASE_URL}/users/normal-user`

// Statistic api
export const WEEKLY_REMINDERS_STATISTIC_URL = `${STATISTIC_BASE_URL}/weekly`
export const MONTHLY_REMINDERS_STATISTIC_URL = `${STATISTIC_BASE_URL}/monthly`
export const YEARLY_REMINDERS_STATISTIC_URL = `${STATISTIC_BASE_URL}/yearly`
export const YEARLY_REMINDERS_STATISTIC_BY_SEMESTER_URL = `${STATISTIC_BASE_URL}/yearly-by-semester`
export const SEMESTER_REMINDERS_COUNT_URL = `${STATISTIC_BASE_URL}/semester`
export const GET_LAST_UPDATED_URL = `${BASE_URL}/statistic/last-updated`

// Email log api
export const EMAIL_LOG_URL = `${BASE_URL}/emailLogs`

// Setting api
export const BACKGROUND_SETTING_URL = '/fe/api/upload'
export const BACKGROUND_REMOVE_SETTINGS_URL = '/fe/api/remove'

// Dashboard api
export const DASHBOARD_DATA_URL = `${BASE_URL}/dashboards`

// App Settings api
export const APP_SETTINGS_URL = `${BASE_URL}/appSettings`

//2FA api
export const TWO_FACTOR_AUTHENTICATION_URL = `${BASE_URL}/Mfa`
// Student need care api
export const GET_ALL_STUDENT_NEED_CARE_URL = `${BASE_URL}/studentNeedCares`
export const GET_STUDENT_NEED_CARE_STATISTICS_URL = `${BASE_URL}/studentNeedCares/care-status-count`
export const SCAN_STUDENT_NEED_CARE_URL = `${GET_ALL_STUDENT_NEED_CARE_URL}/scan`
export const SCAN_STUDENT_NEED_CARE_LIST_URL = `${GET_ALL_STUDENT_NEED_CARE_URL}/scanned-list`
export const SCAN_STUDENT_NEED_CARE_CONFIRM = `${GET_ALL_STUDENT_NEED_CARE_URL}/confirm`
export const SCAN_STUDENT_NEED_CARE_ANALYZE = `${GET_ALL_STUDENT_NEED_CARE_URL}/analyze`
export const SCAN_STUDENT_NEED_CARE_FINAL_EVALUATE = `${GET_ALL_STUDENT_NEED_CARE_URL}/final-evaluate`

// Student need care assignment api
export const STUDENT_NEED_CARE_ASSIGNMENT_URL = `${BASE_URL}/studentCareAssignments`
export const STUDENT_NEED_CARE_ASSIGNMENT_AUTO_ASSIGN_URL = `${STUDENT_NEED_CARE_ASSIGNMENT_URL}/auto-assign`
export const STUDENT_NEED_CARE_ASSIGNMENT_AUTO_ASSIGN_PERCENT_URL = `${STUDENT_NEED_CARE_ASSIGNMENT_URL}/auto-assign-with-percentage`
export const STUDENT_NEED_CARE_ASSIGNMENT_STATISTICS_URL = `${STUDENT_NEED_CARE_ASSIGNMENT_URL}/user-assigned-count`

// ProgressCriterion Type api
export const PROGRESS_CRITERION_TYPE_URL = `${BASE_URL}/progressCriterionTypes`

// Chatbot api
export const CHATBOT_URL = `${BASE_CHAT_URL}/chat`
export const CHATBOT_SETTINGS = `${BASE_CHAT_URL}/settings`

// ProgressCriteria api
export const PROGRESS_CRITERIA_URL = `${BASE_URL}/progressCriteria`
export const PROGRESS_CRITERIA_UPDATE_ALL_URL = `${PROGRESS_CRITERIA_URL}/update-all`

// Stringee api
export const STRINGEE_SERVICE_URL = `${BASE_URL}/stringees`
export const STRINGEE_SERVICE_TOKEN_URL = `${STRINGEE_SERVICE_URL}/token`

// Goolge script api
export const GOOGLE_SCRIPT_URL = BASE_GOOGLE_SCRIPT_URL
