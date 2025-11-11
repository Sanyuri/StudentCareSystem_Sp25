import { QuestionCircleOutlined } from '@ant-design/icons'
import { Card, Typography } from 'antd'
import { t } from 'i18next'
import { ReactNode } from 'react'

// Generate a unique color that is visible on both light and dark backgrounds
function generateUniqueColor(): string {
  let color
  let luminance
  do {
    color = `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0')}`
    const r: number = parseInt(color.substring(1, 3), 16)
    const g: number = parseInt(color.substring(3, 5), 16)
    const b: number = parseInt(color.substring(5, 7), 16)
    luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  } while (luminance <= 0.25 || luminance >= 0.75)
  return color
}

export const EmailTemplateContentRight = (emailType: string): ReactNode => {
  const { Title, Text, Paragraph } = Typography

  // Define all variables with type and mapping
  const variablesMap: Record<string, { color: string; title: string; description: string }[]> = {
    student: [
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.STUDENT_NAME'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.STUDENT_NAME_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.STUDENT_CODE'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.STUDENT_CODE_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.CLASS'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.CLASS_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.MAJOR'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.MAJOR_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.EMAIL'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.EMAIL_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.GENDER'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.GENDER_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.CURRENT_TERM'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.CURRENT_TERM_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.SPECIALIZATION'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.SPECIALIZATION_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.MOBILE_PHONE'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.MOBILE_PHONE_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.PARENT_PHONE'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.PARENT_PHONE_DESCRIPTION'),
      },
    ],
    attendance: [
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.CLASS_NAME'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.CLASS_NAME_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.SEMESTER_NAME'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.SEMESTER_NAME_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.SUBJECT'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.SUBJECT_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.TOTAL_ABSENCES'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.TOTAL_ABSENCES_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.TOTAL_SLOTS'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.TOTAL_SLOTS_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.ABSENCE_RATE'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.ABSENCE_RATE_DESCRIPTION'),
      },
    ],
    defer: [
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.DESCRIPTION'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.DESCRIPTION_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.DEFER_SEMESTER'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.DEFER_SEMESTER_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.DEFERMENT_DATE'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.DEFERMENT_DATE_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.START_DATE'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.START_DATE_DESCRIPTION'),
      },
      {
        color: generateUniqueColor(),
        title: t('EMAILTEMPLATES.POPOVER.PARAMETERS.END_DATE'),
        description: t('EMAILTEMPLATES.POPOVER.PARAMETERS.END_DATE_DESCRIPTION'),
      },
    ],
  }

  // Determine variables to display
  const getVariablesToDisplay = (type: string) => {
    switch (type) {
      case 'attendanceNotification':
      case 'failSubjectNotification':
        return [...variablesMap.student, ...variablesMap.attendance]
      case 'deferNotification':
        return [...variablesMap.student, ...variablesMap.defer]
      default:
        return variablesMap.student
    }
  }

  const variablesToDisplay = getVariablesToDisplay(emailType)

  return (
    <div
      className='email-template-content max-w-md mx-auto p-4 rounded-lg shadow'
      style={{ maxHeight: '500px', overflowY: 'auto' }}
    >
      <div className='header flex items-center mb-4'>
        <QuestionCircleOutlined className='text-green-500 text-2xl mr-2' />
        <Title level={3} className='m-0'>
          {t('EMAILTEMPLATES.POPOVER.PARAMETERS.TITLE')}
        </Title>
      </div>
      <Paragraph className='description text-gray-600 mb-4'>
        {t('EMAILTEMPLATES.POPOVER.PARAMETERS.PARAMETER_DESCRIPTION')}
      </Paragraph>

      {/* Scrollable Content */}
      <div className='scrollable-content'>
        {variablesToDisplay.map(({ color, title, description }) => (
          <Card key={title} className='parameter-card mb-3 shadow-sm'>
            <Title level={5}>{title}</Title>
            <Text code className='parameter-code flex items-center rounded mb-1'>
              <span style={{ color }}>{'</>'}</span> {title}
            </Text>
            <Paragraph>{description}</Paragraph>
          </Card>
        ))}
      </div>
    </div>
  )
}
