const getActiveKeyFromUrl = (pathname: string): string => {
  switch (true) {
    case pathname === '/':
      return 'dashboard'
    case pathname.startsWith('/scan-attendance'):
      return 'scan-attendance'
    case pathname.startsWith('/manage-account'):
      return 'manage-account'
    case pathname.startsWith('/settings'):
      return 'settings'
    case pathname.startsWith('/activity'):
      return 'activity'
    case pathname.startsWith('/email-template'):
      return 'email-template'
    case pathname.startsWith('/email-log'):
      return 'email-log'
    case pathname.startsWith('/application'):
      return 'application'
    case pathname.startsWith('/student-management'):
      return 'student-management'
    case pathname.startsWith('/subject'):
      return 'subject'
    case pathname.startsWith('/note-management'):
      return 'note-management'
    case pathname.startsWith('/psychology-management'):
      return 'psychology-management'
    case pathname.startsWith('/defer-management'):
      return 'defer-management'
    case pathname.startsWith('/student-failed-course'):
      return 'student-failed-course'
    case pathname.startsWith('/manage-permission'):
      return 'manage-permission'
    case pathname.startsWith('/student-need-care'):
      return 'student-need-care'
    case pathname.startsWith('/ai-setting'):
      return 'ai-setting'
    default:
      return ''
  }
}

export default getActiveKeyFromUrl
