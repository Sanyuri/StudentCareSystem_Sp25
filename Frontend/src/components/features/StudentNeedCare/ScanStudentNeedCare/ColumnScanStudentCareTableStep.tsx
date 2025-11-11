import { Breakpoint, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { ColumnProps } from 'antd/es/table/index.js'
import SanitizedHTML from '#components/common/SanitizedHTML.js'
import { StudentNeedCareModel } from '#types/Data/StudentNeedCare.js'
import DeleteConfirmModal from '#components/common/deleteModal/DeleteConfirmModal.js'
import { useDeleteStudentCareScanMutation } from '#hooks/api/studentNeedCare/useStudentNeedCareMutation.js'

const useColumScanStudentCareStep = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  step: number,
  page: number,
  pageSize: number,
): ColumnProps<StudentNeedCareModel>[] => {
  const { t } = useTranslation()
  const { mutate: deleteScanStudentCare } = useDeleteStudentCareScanMutation()
  const handleDeleteStudentNeedCare = (studentCode: string) => {
    deleteScanStudentCare({ studentCode })
  }

  return [
    {
      title: '#',
      dataIndex: 'id',
      width: 35,
      align: 'center',
      render: (_: unknown, __: StudentNeedCareModel, index: number): number =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: t('STUDENT_NEED_CARE.SCAN.SECOND_STEP.TABLE.STUDENT_CODE'),
      key: 'studentCode',
      dataIndex: 'student.studentCode',
      width: 60,
      align: 'center',
      render: (_: unknown, record: StudentNeedCareModel) => (
        <SanitizedHTML htmlContent={record.student.studentCode} />
      ),
    },
    {
      title: t('STUDENT_NEED_CARE.SCAN.SECOND_STEP.TABLE.STUDENT_NAME'),
      width: 60,
      align: 'center',
      render: (_, record: StudentNeedCareModel) => (
        <SanitizedHTML htmlContent={record.student.studentName} />
      ),
    },
    {
      title: t('STUDENT_NEED_CARE.SCAN.SECOND_STEP.TABLE.RANKING'),
      width: 60,
      align: 'center',
      render: (_, record: StudentNeedCareModel) => (
        <SanitizedHTML htmlContent={record.rank?.toString()} />
      ),
    },
    {
      title: t('STUDENT_NEED_CARE.SCAN.SECOND_STEP.TABLE.SPECIALIZATION'),
      width: 60,
      align: 'center',
      render: (_, record: StudentNeedCareModel) => (
        <SanitizedHTML htmlContent={record.student.specialization} />
      ),
    },
    {
      title: t('STUDENT_NEED_CARE.SCAN.SECOND_STEP.TABLE.CURRENT_SEMESTER'),
      width: 60,
      align: 'center',
      render: (_, record: StudentNeedCareModel) => (
        <SanitizedHTML htmlContent={record.student.currentTermNo?.toString()} />
      ),
    },
    {
      title: t('STUDENT_NEED_CARE.SCAN.SECOND_STEP.TABLE.STATUS'),
      width: 60,
      align: 'center',
      render: (_, record: StudentNeedCareModel) => (
        <SanitizedHTML htmlContent={record.student.progress} />
      ),
    },
    {
      title: t('STUDENT_NEED_CARE.SCAN.SECOND_STEP.TABLE.ACTION'),
      key: 'action',
      width: 60,
      align: 'center',
      hidden: step != 2,
      render: (data: StudentNeedCareModel) => (
        <Button type='text'>
          <DeleteConfirmModal handleDelete={() => handleDeleteStudentNeedCare(data.studentCode)} />
        </Button>
      ),
    },
  ]
}

export default useColumScanStudentCareStep
