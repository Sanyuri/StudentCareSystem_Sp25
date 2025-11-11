import { SubEmailResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { Button } from 'antd'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

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

interface VariableButtonProps {
  onClick: () => void
  label: string
  text: string
}

// Single button component
const VariableButton: FC<VariableButtonProps> = ({
  onClick,
  label,
  text,
}: VariableButtonProps): ReactNode => {
  return (
    <Button onClick={onClick} style={{ margin: '3px 0' }}>
      <label style={{ color: generateUniqueColor(), marginRight: 1 }}>{label}</label>
      {text}
    </Button>
  )
}

// Generalized component for rendering groups of buttons
const VariableButtonGroup: FC<{
  variables: { key: string; label: string }[]
  insertVariable?: (variable: string) => void
  insertClusterVariable?: (variable: string) => void
  label?: string
}> = ({ variables, insertVariable, insertClusterVariable, label }): ReactNode => {
  const { t } = useTranslation()

  const handleInsertVariable = (variable: string): void => {
    if (insertClusterVariable) {
      insertClusterVariable(variable)
    } else if (insertVariable) {
      insertVariable(variable)
    }
  }

  return (
    <div className='flex flex-col'>
      {variables.map(
        (variable): ReactNode => (
          <VariableButton
            key={variable.key}
            onClick={(): void => {
              handleInsertVariable(variable.key)
            }}
            label={label ?? ''}
            text={t(variable.label)}
          />
        ),
      )}
    </div>
  )
}

// Usage for each specific group
export const StudentVariableButtons: FC<{ insertVariable: (variable: string) => void }> = ({
  insertVariable,
}) => {
  const studentVariables = [
    { key: 'StudentName', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.STUDENT_NAME' },
    { key: 'StudentCode', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.STUDENT_CODE' },
    { key: 'Class', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.CLASS' },
    { key: 'Major', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.MAJOR' },
    { key: 'Email', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.EMAIL' },
    { key: 'Gender', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.GENDER' },
    { key: 'CurrentTermNo', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.CURRENT_TERM' },
    { key: 'Specialization', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.SPECIALIZATION' },
    { key: 'MobilePhone', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.MOBILE_PHONE' },
    { key: 'ParentPhone', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.PARENT_PHONE' },
  ]

  return (
    <VariableButtonGroup
      variables={studentVariables}
      insertVariable={insertVariable}
      label={'</>'}
    />
  )
}

export const AttendanceVariableButton: FC<{ insertVariable: (variable: string) => void }> = ({
  insertVariable,
}) => {
  const attendanceVariables = [
    { key: 'ClassName', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.CLASS_NAME' },
    { key: 'SemesterName', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.SEMESTER_NAME' },
    { key: 'SubjectCode', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.SUBJECT' },
    { key: 'TotalAbsences', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.TOTAL_ABSENCES' },
    { key: 'TotalSlots', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.TOTAL_SLOTS' },
    { key: 'AbsenceRate', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.ABSENCE_RATE' },
  ]

  return (
    <VariableButtonGroup
      variables={attendanceVariables}
      insertVariable={insertVariable}
      label={'</>'}
    />
  )
}

export const StudentDeferVariableButton: FC<{
  insertVariable: (variable: string) => void
}> = ({ insertVariable }) => {
  const deferVariables = [
    { key: 'Description', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.DESCRIPTION' },
    { key: 'DeferSemester', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.DEFER_SEMESTER' },
    { key: 'DefermentDate', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.DEFERMENT_DATE' },
    { key: 'StartDate', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.START_DATE' },
    { key: 'EndDate', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.END_DATE' },
  ]

  return (
    <VariableButtonGroup variables={deferVariables} insertVariable={insertVariable} label={'</>'} />
  )
}

export const StudentFailedSubjectVariableButton: FC<{
  insertVariable: (variable: string) => void
}> = ({ insertVariable }) => {
  const failedSubjectVariables = [
    { key: 'SubjectCode', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.SUBJECT' },
    { key: 'AverageMark', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.AVERAGE_MARK' },
    { key: 'FailReason', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.FAIL_REASON' },
    { key: 'ClassName', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.CLASS_NAME' },
    { key: 'SemesterName', label: 'EMAILTEMPLATES.POPOVER.PARAMETERS.SEMESTER_NAME' },
  ]

  return (
    <VariableButtonGroup
      variables={failedSubjectVariables}
      insertVariable={insertVariable}
      label={'</>'}
    />
  )
}

export const ClusterParameterButton: FC<{
  variables: SubEmailResponse[]
  insertClusterVariable: (variable: string) => void
}> = ({ insertClusterVariable, variables }) => {
  const clusterVariables = []
  for (const item of variables) {
    clusterVariables.push({ key: item.name, label: item.name })
  }
  return (
    <VariableButtonGroup
      variables={clusterVariables}
      insertClusterVariable={insertClusterVariable}
      label=''
    />
  )
}
