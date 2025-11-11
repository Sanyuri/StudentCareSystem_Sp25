import _ from 'lodash'
import { useState } from 'react'
import authState from '#stores/authState.js'
import { ColumnProps } from 'antd/es/table/index.js'
import { RoleValue } from '#utils/constants/role.js'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { DefaultNoteType } from '#utils/constants/Note/index.js'
import { AccountList } from '#types/ResponseModel/ApiResponse.js'
import NoteComponent from '#components/common/note/NoteComponent.js'
import { useAccountData } from '#hooks/api/account/useAccountData.js'
import { FilterStatus } from '#types/RequestModel/AccountListRequest.js'
import { StudentCareStatus } from '#utils/constants/studentCareStatus.js'
import { Breakpoint, Flex, Modal, Select, Spin, Tag, Typography } from 'antd'
import { useNoteTypeDefaultData } from '#hooks/api/noteType/useNoteTypeData.js'
import DeleteConfirmModal from '#components/common/deleteModal/DeleteConfirmModal.js'
import { StudentCareAssignment, StudentNeedCareModel } from '#types/Data/StudentNeedCare.js'
import { useDeleteStudentNeedCareMutation } from '#hooks/api/studentNeedCare/useStudentNeedCareMutation.js'
import {
  useAddAssignStudentCareMutation,
  useUpdateAssignStudentCareMutation,
} from '#hooks/api/studentCareAssignment/useStudentCareAssignmentMutation.js'
import {
  AddStudentCareAssignmentRequest,
  UpdateStudentCareAssignmentRequest,
} from '#types/RequestModel/StudentCareAssignment.js'
import { useNavigateWithLoading } from '#hooks/useNavigateSider.js'
import { STUDENT_NEED_CARE_PATH } from '#utils/constants/path.js'
import { useTranslation } from 'react-i18next'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'

const useStudentNeedCareColumn = (
  screens: {
    [key in Breakpoint]?: boolean
  },
  page: number,
  pageSize: number,
): ColumnProps<StudentNeedCareModel>[] => {
  const { t } = useTranslation()
  const { role } = authState()

  const { data: careNoteType } = useNoteTypeDefaultData(DefaultNoteType.Care)
  const { data: careOfficers } = useAccountData('active' as FilterStatus, RoleValue.OFFICER)
  const { mutate: deleteStudentNeedCare } = useDeleteStudentNeedCareMutation()
  const { mutate: updateAssign } = useUpdateAssignStudentCareMutation()
  const { mutate: addAssign } = useAddAssignStudentCareMutation()

  const { navigateWithLoading } = useNavigateWithLoading()
  const [selectedOfficerId, setSelectedOfficerId] = useState<string | null>(null)
  const [pendingAssignment, setPendingAssignment] = useState<{
    careAssignmentId: string
    careId: string
  } | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { hasPermission } = useCheckPermission()

  const hasEditPermission = hasPermission(PermissionType.WriteStudentCare)

  const handleSelect = (careAssignmentId: string, careId: string, officerId: string) => {
    setSelectedOfficerId(officerId)
    setPendingAssignment({ careAssignmentId, careId })
    setIsModalVisible(true)
  }

  const handleOk = () => {
    if (selectedOfficerId) {
      if (pendingAssignment) {
        if (!pendingAssignment.careAssignmentId) {
          const addAssignee: AddStudentCareAssignmentRequest = {
            studentNeedCareId: pendingAssignment.careId,
            userId: selectedOfficerId,
          }
          addAssign(addAssignee)
        }
        handleUpdateAssign(
          pendingAssignment.careAssignmentId,
          selectedOfficerId,
          pendingAssignment.careId,
        )
      }
    }
    setIsModalVisible(false)
    setPendingAssignment(null) // Reset state
  }

  const handleDeleteStudentNeedCare = (id: string) => {
    deleteStudentNeedCare({ id })
  }

  const handleUpdateAssign = (
    id: string | undefined,
    userId: string,
    studentNeedCareId: string,
  ) => {
    if (!id) return
    const updateAssignee: UpdateStudentCareAssignmentRequest = {
      id,
      userId,
      studentNeedCareId,
    }
    updateAssign(updateAssignee)
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
      title: t('STUDENT_NEED_CARE.TABLE.STUDENT_CODE'),
      dataIndex: 'student.studentCode',
      width: 60,
      align: 'center',
      render: (_: unknown, studentData: StudentNeedCareModel) => (
        <Typography.Link
          onClick={async () =>
            await navigateWithLoading({
              path: `${STUDENT_NEED_CARE_PATH}/${studentData.id}`,
              loadingKey: 'student-need-care',
            })
          }
        >
          {studentData.studentCode}
        </Typography.Link>
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
        return (
          <div>
            <Select
              value={
                careOfficers?.items.find(
                  (careOfficer: AccountList) => careOfficer.id === defaultAssignee?.user.id,
                )?.id
              }
              onChange={(officerChosen: string) =>
                handleSelect(
                  studentCareData.studentCareAssignments[0]?.id,
                  studentCareData.id,
                  officerChosen,
                )
              }
              style={{ width: '100%' }}
            >
              {careOfficers?.items.map((officer: AccountList) => (
                <Select.Option key={officer.id} value={officer.id}>
                  {officer.fullName}
                </Select.Option>
              ))}
            </Select>

            <Modal
              title={t('STUDENT_NEED_CARE.TABLE.UPDATE_ASSIGNMENT.TITLE')}
              open={isModalVisible}
              onOk={handleOk}
              onCancel={() => setIsModalVisible(false)}
              centered
              mask={false}
              height={400}
            >
              <p>{t('STUDENT_NEED_CARE.TABLE.UPDATE_ASSIGNMENT.CONFIRM')}</p>
            </Modal>
          </div>
        )
      },
    },
    {
      title: t('STUDENT_NEED_CARE.TABLE.ACTION'),
      key: 'action',
      width: 60,
      align: 'center',
      render: (data: StudentNeedCareModel) => {
        if (!careNoteType) {
          return <Spin />
        }
        return (
          <Flex justify={'space-evenly'} align={'center'}>
            <NoteComponent
              noteType={careNoteType}
              studentRecord={data.student}
              entityId={data.id}
            />
            {hasEditPermission && (
              <DeleteConfirmModal handleDelete={() => handleDeleteStudentNeedCare(data.id)} />
            )}
          </Flex>
        )
      },
    },
  ]
}

export default useStudentNeedCareColumn
