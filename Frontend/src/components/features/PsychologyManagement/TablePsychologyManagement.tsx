import { Button, Table } from 'antd'
import { ColumnType } from 'antd/es/table'
import { navigate } from 'vike/client/router'
import { useTranslation } from 'react-i18next'
import usePagination from '#hooks/usePagination.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import ChangePasswordModal from '../StudentPsychology/ChangePasswordModal'
import ForgetPasswordModal from '../StudentPsychology/ForgetPasswordModal'
import { useStudentPsychologyData } from '#hooks/api/useStudentPsychologyData.js'
import HideValueSensitive from '#components/common/HideValueSensitive/HideValueSensitive.js'
import { StudentPsychologyFilter } from '#src/types/RequestModel/StudentPsychologyRequest.js'
import { StudentPsychologyResponse } from '#src/types/ResponseModel/StudentPsychologyResponse.js'

const TablePsychologyManagement = ({ filter }: { filter: StudentPsychologyFilter }) => {
  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()

  const { data, isFetching } = useStudentPsychologyData(filter)
  const { t } = useTranslation()

  const { hasPermission } = useCheckPermission()
  const hasEditPermission = hasPermission(PermissionType.WriteStudentPsychology)

  const redirectToPsychologyNote = async (psychologyId: string) => {
    await navigate(`/psychology-note/${psychologyId}`)
  }

  const columns: ColumnType<StudentPsychologyResponse>[] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'center' as const,
      render: (_: unknown, __: StudentPsychologyResponse, index: number) =>
        index + 1 + (page - 1) * pageSize,
    },
    {
      title: t('STUDENT_PSYCHOLOGY.TABLE.STUDENT_NAME'),
      dataIndex: 'student.studentName',
      key: 'studentName',
      align: 'center' as const,
      render: (_: unknown, record: StudentPsychologyResponse) => record.student.studentName,
    },
    {
      title: t('STUDENT_PSYCHOLOGY.TABLE.STUDENT_CODE'),
      dataIndex: 'student.studentCode',
      key: 'studentCode',
      align: 'center' as const,
      render: (_: unknown, record: StudentPsychologyResponse) => record.student.studentCode,
    },
    { title: 'Email', dataIndex: 'student.email', key: 'email', align: 'center' as const },
    {
      title: t('STUDENT_PSYCHOLOGY.TABLE.PHONE_NUMBER'),
      dataIndex: 'student.mobilePhone',
      key: 'mobilePhone',
      align: 'center' as const,
      render: (_: unknown, record: StudentPsychologyResponse) => (
        <HideValueSensitive data={record?.student.mobilePhone} />
      ),
    },
    {
      title: t('STUDENT_PSYCHOLOGY.TABLE.FUNCTION'),
      dataIndex: 'actions',
      key: 'actions',
      width: 300,
      hidden: !hasEditPermission,
      align: 'center' as const,
      render: (_: unknown, record: StudentPsychologyResponse) => (
        <div className='flex justify-center space-x-2'>
          <ChangePasswordModal id={record.id} />
          <ForgetPasswordModal id={record.id} />
          <Button
            className='px-2 py-1 bg-blue-500 text-white rounded'
            onClick={() => redirectToPsychologyNote(record.id)}
          >
            {t('STUDENT_PSYCHOLOGY.TABLE.DETAIL')}
          </Button>
          <Button className='px-2 py-1 bg-blue-500 text-white rounded' onClick={() => {}}>
            {t('STUDENT_PSYCHOLOGY.TABLE.COMPLETE')}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Table
      loading={isFetching}
      rowKey='id'
      bordered
      size='large'
      columns={columns}
      dataSource={data?.items || []}
      pagination={{
        current: page,
        onChange: handlePageChange,
        total: data?.totalItems,
        defaultPageSize: pageSizeRef.current,
        pageSize,
        showSizeChanger: true,
        showTotal: (total) => t('COMMON.TOTAL_RECORDS', { total }),
        position: ['bottomCenter'],
      }}
    />
  )
}

export default TablePsychologyManagement
