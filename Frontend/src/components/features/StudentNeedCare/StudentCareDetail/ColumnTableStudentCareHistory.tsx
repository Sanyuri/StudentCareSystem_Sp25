import _ from 'lodash'
import authState from '#stores/authState.js'
import { Breakpoint, Button, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { ColumnProps } from 'antd/es/table/index.js'
import { RoleValue } from '#utils/constants/role.js'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { AccountList } from '#types/ResponseModel/ApiResponse.js'
import { useAccountData } from '#hooks/api/account/useAccountData.js'
import { FilterStatus } from '#types/RequestModel/AccountListRequest.js'
import { StudentCareStatus } from '#utils/constants/studentCareStatus.js'
import { StudentCareAssignment, StudentNeedCareModel } from '#types/Data/StudentNeedCare.js'

const useStudentCareHistoryColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
  handleViewDetail: (studentData: StudentNeedCareModel) => void,
): ColumnProps<StudentNeedCareModel>[] => {
  const { t } = useTranslation()
  const { role } = authState()

  const { data: careOfficers } = useAccountData('active' as FilterStatus, RoleValue.OFFICER)

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
      title: t('STUDENT_NEED_CARE.TABLE.STUDENT_CODE'),
      dataIndex: 'student.studentCode',
      width: 60,
      align: 'center',
      render: (_: unknown, studentData: StudentNeedCareModel) => (
        <Button
          type='text'
          onClick={() => handleViewDetail(studentData)}
          style={{ color: '#1890ff' }}
        >
          {studentData.studentCode}
        </Button>
      ),
    },
    {
      title: t('STUDENT_NEED_CARE.TABLE.STUDENT_NAME'),
      width: 60,
      align: 'center',
      render: (_, record: StudentNeedCareModel) => <span>{record.student.studentName}</span>,
    },
    {
      title: t('STUDENT_NEED_CARE.TABLE.NEED_CARE_NEXT_TERM'),
      dataIndex: 'needsCareNextTerm',
      width: 60,
      align: 'center',
      render: (value: boolean) =>
        value ? (
          <Tag color='green' className={'mr-0'}>
            <CheckOutlined />
          </Tag>
        ) : (
          <Tag color='red' className={'mr-0'}>
            <CloseOutlined />
          </Tag>
        ),
    },
    {
      title: t('STUDENT_NEED_CARE.TABLE.IS_PROGRESSING'),
      dataIndex: 'isProgressing',
      width: 60,
      align: 'center',
      render: (value: boolean) =>
        value ? (
          <Tag color='green' className={'mr-0'}>
            <CheckOutlined />
          </Tag>
        ) : (
          <Tag color='red' className={'mr-0'}>
            <CloseOutlined />
          </Tag>
        ),
    },
    {
      title: t('STUDENT_NEED_CARE.TABLE.IS_COLLABORATING'),
      dataIndex: 'isCollaborating',
      width: 60,
      align: 'center',
      render: (value: boolean) =>
        value ? (
          <Tag color='green' className={'mr-0'}>
            <CheckOutlined />
          </Tag>
        ) : (
          <Tag color='red' className={'mr-0'}>
            <CloseOutlined />
          </Tag>
        ),
    },
    {
      title: t('STUDENT_NEED_CARE.TABLE.CARE_STATUS'),
      dataIndex: 'careStatus',
      width: 60,
      align: 'center',
      render: (status: string) => (
        <Tag
          className={'mr-0'}
          color={status === StudentCareStatus.Done.toString() ? 'success' : 'error'}
        >
          {status}
        </Tag>
      ),
    },

    {
      title: t('STUDENT_NEED_CARE.TABLE.ASSIGNMENT'),
      dataIndex: 'studentCareAssignments',
      width: 90,
      align: 'center',
      hidden: role !== RoleValue.MANAGER,
      render: (value: unknown, studentCareData: StudentNeedCareModel) => {
        const defaultAssignee: StudentCareAssignment | undefined = _.first(
          studentCareData?.studentCareAssignments,
        )

        // Find the officer name from the careOfficers data
        const assignedOfficer = careOfficers?.items.find(
          (careOfficer: AccountList) => careOfficer.id === defaultAssignee?.user.id,
        )

        // Display just the officer name
        return <div>{assignedOfficer ? assignedOfficer.fullName : t('COMMON.NOT_ASSIGNED')}</div>
      },
    },
  ]
}

export default useStudentCareHistoryColumn
