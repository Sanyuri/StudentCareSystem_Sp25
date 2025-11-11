import { useStudentPsychologyData } from '#hooks/api/psychologyNotes/usePsychologyNoteData.js'
import { useTranslation } from 'react-i18next'
import { usePageContext } from 'vike-react/usePageContext'
import { PageContext } from 'vike/types'
import { useStudentNeedCareDetailData } from '#hooks/api/studentNeedCare/useStudentNeedCareData.js'

const useGetPageTitle = (urlPathname: string): string => {
  const { t } = useTranslation()
  const pageContext: PageContext = usePageContext()
  const id: string = pageContext.routeParams['id'] ?? ''
  const isPsychologyPage: boolean = urlPathname.startsWith('/psychology-note/')
  const isCarePage: boolean = urlPathname.startsWith('/student-need-care/')
  const {
    data: studentInfo,
    isLoading,
    error,
    refetch: studentPsychologyFetch,
  } = useStudentPsychologyData(id, isPsychologyPage)
  const {
    data: studentCareInfo,
    isLoading: isLoadingCare,
    refetch: studentCareFetch,
  } = useStudentNeedCareDetailData(id, isCarePage)
  const titleMapping: { [key: string]: string } = {
    '/': t('LAYOUT.DASHBOARD'),
    '/scan-attendance': t('LAYOUT.ATTENDANCE'),
    '/profile': 'Profile',
    '/settings': t('LAYOUT.SETTING'),
    '/activity': t('LAYOUT.ACTIVITY_LOG'),
    '/manage-account': t('LAYOUT.STAFF_ACCOUNTS'),
    '/email-template': t('LAYOUT.EMAIL_TEMPLATES'),
    '/application': t('LAYOUT.RECORD_ORDER'),
    '/student-management': t('LAYOUT.STUDENT_MANAGEMENT'),
    '/defer-management': t('LAYOUT.RESERVED_STUDENT'),
    '/application-type': t('LAYOUT.APPLICATION_TYPE'),
    '/subject': t('LAYOUT.EXEMPT_SUBJECTS'),
    '/note-management': t('LAYOUT.NOTES_MANAGEMENT'),
    '/student-failed-course': t('LAYOUT.STUDENT_FAILED_COURSE'),
    '/psychology-management': t('LAYOUT.PSYCHOLOGY_MANAGEMENT'),
    '/psychology-note': t('LAYOUT.PSYCHOLOGY_NOTE'),
    '/manage-permission': t('LAYOUT.PERMISSION'),
    '/email-log': t('LAYOUT.EMAIL_LOG'),
    '/student-need-care': t('LAYOUT.CARE_REQUIRED_STUDENT'),
    '/ai-setting': t('LAYOUT.AI_SETTINGS'),
  }
  if (urlPathname.startsWith('/psychology-note/')) {
    void studentPsychologyFetch()
    if (isLoading) {
      return `${t('LAYOUT.PSYCHOLOGY_NOTE')} - ${t('LAYOUT.LOADING')}`
    }

    if (error || !studentInfo) {
      return `${t('LAYOUT.PSYCHOLOGY_NOTE')} - ${t('LAYOUT.UNKNOWN_STUDENT')}`
    }

    const studentName = studentInfo.student.studentName || t('LAYOUT.UNKNOWN_STUDENT')
    return `${t('LAYOUT.PSYCHOLOGY_NOTE')} - ${studentName} (${studentInfo.studentCode})`
  }
  if (urlPathname.startsWith('/student-need-care/')) {
    void studentCareFetch()
    if (isLoadingCare) {
      return `${t('LAYOUT.CARE_REQUIRED_STUDENT')} - ${t('LAYOUT.LOADING')}`
    }
    if (error || !studentCareInfo) {
      return `${t('LAYOUT.PSYCHOLOGY_NOTE')} - ${t('LAYOUT.UNKNOWN_STUDENT')}`
    }
    return `${t('LAYOUT.CARE_REQUIRED_STUDENT')} - ${studentCareInfo?.student?.studentName} (${studentCareInfo?.student?.studentCode})`
  }
  // Return the matching title or a default one
  return titleMapping[urlPathname] || 'Default Title'
}

export default useGetPageTitle
