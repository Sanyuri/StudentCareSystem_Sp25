import icon from '../icon'
import { useTranslation } from 'react-i18next'

export const useAttendanceOptions = () => {
  const { t } = useTranslation()

  const attendanceTableOptions = [
    { label: t('ATTENDANCES.ATTENDANCE_OPTIONS.ALL'), value: 'All' },
    { label: t('ATTENDANCES.ATTENDANCE_OPTIONS.NO_SEND_MAIL'), value: 'no-send-mail' },
    { label: t('ATTENDANCES.ATTENDANCE_OPTIONS.NEED_SEND_MAIL'), value: 'need-send-mail' },
    { label: t('ATTENDANCES.ATTENDANCE_OPTIONS.GROUP_ENG'), value: 'eng' },
    { label: t('ATTENDANCES.ATTENDANCE_OPTIONS.GROUP_CN'), value: 'cn' },
    { label: t('ATTENDANCES.ATTENDANCE_OPTIONS.GROUP_ABSENT'), value: 'absent' },
    { label: t('ATTENDANCES.ATTENDANCE_OPTIONS.SECTOR'), value: 'sector' },
  ]

  const exportAttendance = [
    { icon: icon.excel, text: t('ATTENDANCES.EXPORT_OPTIONS.TODAY_REMINDERS'), param: 'today' },
    {
      icon: icon.excel,
      text: t('ATTENDANCES.EXPORT_OPTIONS.SEMESTER_REMINDERS'),
      param: 'semester',
    },
    {
      icon: icon.excel,
      text: t('ATTENDANCES.EXPORT_OPTIONS.SEMESTER_REMINDERS_COURSE'),
      param: 'semester-course',
    },
    { icon: icon.excel, text: t('ATTENDANCES.EXPORT_OPTIONS.YEAR_REMINDERS'), param: 'year' },
    { icon: icon.excel, text: t('ATTENDANCES.EXPORT_OPTIONS.ENG_STUDENTS'), param: 'eng-group' },
    { icon: icon.excel, text: t('ATTENDANCES.EXPORT_OPTIONS.CN_STUDENTS'), param: 'cn-group' },
    {
      icon: icon.excel,
      text: t('ATTENDANCES.EXPORT_OPTIONS.PREVIOUS_COURSE_REMINDERS'),
      param: 'prev-course',
    },
    {
      icon: icon.excel,
      text: t('ATTENDANCES.EXPORT_OPTIONS.UPDATED_TODAY'),
      param: 'updated-today',
    },
  ]

  return { attendanceTableOptions, exportAttendance }
}
