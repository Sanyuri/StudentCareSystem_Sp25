import { Menu, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  ACTIVITY_PATH,
  APPLICATION_PATH,
  DEFER_MANAGEMENT_PATH,
  EMAIL_LOG_PATH,
  EMAIL_TEMPLATE_PATH,
  MANAGE_ACCOUNT_PATH,
  NOTE_MANAGEMENT_PATH,
  PSYCHOLOGY_MANAGEMENT_PATH,
  SCAN_ATTENDANCE_PATH,
  STUDENT_FAILED_COURSE_PATH,
  STUDENT_MANAGEMENT_PATH,
  SUBJECT_PATH,
  STUDENT_NEED_CARE_PATH,
} from '#utils/constants/path.js'
import { LoadingOutlined } from '@ant-design/icons'
import { FC, ReactNode } from 'react'
import { SideBarProps } from '#types/Props/SidebarProp.js'
import useLoadingStore from '#stores/loadingState.js'
import { useNavigateWithLoading } from '#hooks/useNavigateSider.js'
import StaffAccountIcon from '#assets/icon/staffAccount.svg?react'
import FailStudentIcon from '#assets/icon/Quét sinh viên trượt môn.svg?react'
import EmailTemplateIcon from '#assets/icon/Quản lý mẫu gửi email.svg?react'
import UserIcon from '#assets/icon/a.svg?react'
import StudentCareIcon from '#assets/icon/StudentNeedCare.svg?react'
import RecordOrderIcon from '#assets/icon/RecordApplication.svg?react'
import PsychologyIcon from '#assets/icon/Brain.svg?react'
import ScanAttendanceIcon from '#assets/icon/ScanAttendance.svg?react'
import ScanReservedStudentsIcon from '#assets/icon/ScanDeffer.svg?react'
import EmailLogIcon from '#assets/icon/email send.svg?react'
import ExemptSubjectIcon from '#assets/icon/Subject.svg?react'
import ActivityLogIcon from '#assets/icon/Movie time.svg?react'
import NoteIcon from '#assets/icon/Document.svg?react'

type MenuItem = Required<MenuProps>['items'][number]

const SideBarManager: FC<SideBarProps> = ({
  darkMode,
  collapsed,
  activeKey,
}: SideBarProps): ReactNode => {
  const { t } = useTranslation()
  const { loadingSider } = useLoadingStore()
  const { navigateWithLoading } = useNavigateWithLoading()
  const sideBarManager: MenuItem[] = [
    {
      key: '1',
      label: '',
      type: 'group',
      children: [
        {
          key: 'student-need-care',
          icon:
            loadingSider === 'student-need-care' ? (
              <LoadingOutlined />
            ) : (
              <StudentCareIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />
            ),
          label: <span>{t('LAYOUT.CARE_REQUIRED_STUDENT')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({
              path: STUDENT_NEED_CARE_PATH,
              loadingKey: 'student-need-care',
            }),
        },
        {
          key: 'application',
          icon:
            loadingSider === 'application' ? (
              <LoadingOutlined />
            ) : (
              <RecordOrderIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />
            ),
          label: <span>{t('LAYOUT.RECORD_ORDER')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({ path: APPLICATION_PATH, loadingKey: 'application' }),
        },
        {
          key: 'psychology-management',
          icon:
            loadingSider === 'psychology-management' ? (
              <LoadingOutlined />
            ) : (
              <PsychologyIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />
            ),
          label: <span>{t('LAYOUT.PSYCHOLOGY_MANAGEMENT')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({
              path: PSYCHOLOGY_MANAGEMENT_PATH,
              loadingKey: 'psychology-management',
            }),
        },
      ],
    },
    {
      key: 'group2',
      label: !collapsed ? <span>{t('LAYOUT.SCAN_INFO')}</span> : <span className='hidden'></span>,
      type: 'group',
      children: [
        {
          key: 'scan-attendance',
          icon:
            loadingSider === 'scan-attendance' ? (
              <LoadingOutlined />
            ) : (
              <ScanAttendanceIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />
            ),
          label: <span>{t('LAYOUT.ATTENDANCE')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({
              path: SCAN_ATTENDANCE_PATH,
              loadingKey: 'scan-attendance',
            }),
        },
        {
          key: 'defer-management',
          icon:
            loadingSider === 'defer-management' ? (
              <LoadingOutlined />
            ) : (
              <ScanReservedStudentsIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />
            ),
          label: <span>{t('LAYOUT.RESERVED_STUDENT')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({
              path: DEFER_MANAGEMENT_PATH,
              loadingKey: 'defer-management',
            }),
        },
        {
          key: 'student-failed-course',
          icon:
            loadingSider === 'student-failed-course' ? (
              <LoadingOutlined />
            ) : (
              <FailStudentIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />
            ),
          label: <span>{t('LAYOUT.FAILED_STUDENT')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({
              path: STUDENT_FAILED_COURSE_PATH,
              loadingKey: 'student-failed-course',
            }),
        },
      ],
    },
    {
      key: 'group3',
      label: !collapsed ? <span>{t('LAYOUT.MANAGE')}</span> : <span className='hidden'></span>,
      type: 'group',
      children: [
        {
          key: 'email-template',
          icon:
            loadingSider === 'email-template' ? (
              <LoadingOutlined />
            ) : (
              <EmailTemplateIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />
            ),
          label: <span>{t('LAYOUT.EMAIL_TEMPLATES')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({ path: EMAIL_TEMPLATE_PATH, loadingKey: 'email-template' }),
        },
        {
          key: 'email-log',
          icon:
            loadingSider === 'email-log' ? (
              <LoadingOutlined />
            ) : (
              <EmailLogIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />
            ),
          label: <span>{t('LAYOUT.EMAIL_LOG')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({ path: EMAIL_LOG_PATH, loadingKey: 'email-log' }),
        },
        {
          key: 'manage-account',
          icon:
            loadingSider === 'manage-account' ? (
              <LoadingOutlined />
            ) : (
              <StaffAccountIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />
            ),
          label: <span>{t('LAYOUT.STAFF_ACCOUNTS')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({ path: MANAGE_ACCOUNT_PATH, loadingKey: 'manage-account' }),
        },

        {
          key: 'subject',
          icon:
            loadingSider === 'subject' ? (
              <LoadingOutlined />
            ) : (
              <ExemptSubjectIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />
            ),
          label: <span>{t('LAYOUT.EXEMPT_SUBJECTS')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({ path: SUBJECT_PATH, loadingKey: 'subject' }),
        },
        {
          key: 'activity',
          icon:
            loadingSider === 'activity' ? (
              <LoadingOutlined />
            ) : (
              <ActivityLogIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />
            ),
          label: <span>{t('LAYOUT.ACTIVITY_LOG')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({ path: ACTIVITY_PATH, loadingKey: 'activity' }),
        },
        {
          key: 'note-management',
          icon:
            loadingSider === 'note-management' ? (
              <LoadingOutlined />
            ) : (
              <NoteIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />
            ),
          label: <span>{t('LAYOUT.NOTES_MANAGEMENT')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({
              path: NOTE_MANAGEMENT_PATH,
              loadingKey: 'note-management',
            }),
        },
        {
          key: 'student-management',
          icon:
            loadingSider === 'student-management' ? (
              <LoadingOutlined />
            ) : (
              <UserIcon width={collapsed ? '16px' : '24px'} height={collapsed ? '16px' : '24px'} />
            ),
          label: <span>{t('LAYOUT.STUDENT_MANAGEMENT')}</span>,
          onClick: async (): Promise<void> =>
            await navigateWithLoading({
              path: STUDENT_MANAGEMENT_PATH,
              loadingKey: 'student-management',
            }),
        },
      ],
    },
  ]

  return (
    <div>
      <Menu
        theme={darkMode ? 'dark' : 'light'}
        selectedKeys={[activeKey, loadingSider ?? '']}
        mode='inline'
        items={sideBarManager}
      />
    </div>
  )
}

export default SideBarManager
