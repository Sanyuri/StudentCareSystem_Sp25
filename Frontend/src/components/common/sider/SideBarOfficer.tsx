import { Menu, MenuProps } from 'antd'
import icon from '#utils/constants/icon.js'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode } from 'react'
import {
  APPLICATION_PATH,
  DEFER_MANAGEMENT_PATH,
  EMAIL_LOG_PATH,
  EMAIL_TEMPLATE_PATH,
  NOTE_MANAGEMENT_PATH,
  PSYCHOLOGY_MANAGEMENT_PATH,
  SCAN_ATTENDANCE_PATH,
  STUDENT_FAILED_COURSE_PATH,
  STUDENT_MANAGEMENT_PATH,
  STUDENT_NEED_CARE_PATH,
} from '#utils/constants/path.js'
import { LoadingOutlined } from '@ant-design/icons'
import useLoadingStore from '#stores/loadingState.js'
import { useNavigateWithLoading } from '#hooks/useNavigateSider.js'
import { SideBarProps } from '#types/Props/SidebarProp.js'
import RecordOrderIcon from '#assets/icon/RecordApplication.svg?react'
import StudentCareIcon from '#assets/icon/StudentNeedCare.svg?react'
import EmailTemplateIcon from '#assets/icon/Quản lý mẫu gửi email.svg?react'
import EmailLogIcon from '#assets/icon/email send.svg?react'
import PsychologyIcon from '#assets/icon/Brain.svg?react'
import ScanReservedStudentsIcon from '#assets/icon/ScanDeffer.svg?react'
import NoteIcon from '#assets/icon/Document.svg?react'
import UserIcon from '#assets/icon/a.svg?react'
import ScanAttendanceIcon from '#assets/icon/ScanAttendance.svg?react'

type MenuItem = Required<MenuProps>['items'][number]

const SideBarOfficer: FC<SideBarProps> = ({
  darkMode,
  collapsed,
  activeKey,
}: SideBarProps): ReactNode => {
  const { loadingSider } = useLoadingStore()
  const { navigateWithLoading } = useNavigateWithLoading()
  const { t } = useTranslation()
  const sideBarOfficer: MenuItem[] = [
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
          key: 'psychology-management',
          icon: <PsychologyIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />,
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
      key: '2',
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
              <img
                src={icon.scanFailedStudents}
                alt='React Logo'
                className={`${darkMode ? 'invert' : 'invert-0'}`}
              />
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
      key: 'note-management',
      icon:
        loadingSider === 'note-management' ? (
          <LoadingOutlined />
        ) : (
          <NoteIcon className={collapsed ? 'w-4 h-4' : 'w-6 h-6'} />
        ),
      label: <span>{t('LAYOUT.NOTES_MANAGEMENT')}</span>,
      onClick: async (): Promise<void> =>
        await navigateWithLoading({ path: NOTE_MANAGEMENT_PATH, loadingKey: 'note-management' }),
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
  ]
  return (
    <Menu
      theme={darkMode ? 'dark' : 'light'}
      selectedKeys={[activeKey, loadingSider ?? '']}
      mode='inline'
      items={sideBarOfficer}
    />
  )
}

export default SideBarOfficer
