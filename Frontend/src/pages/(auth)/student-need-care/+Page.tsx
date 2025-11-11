import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import usePagination from '#hooks/usePagination.js'
import { RoleValue } from '#utils/constants/role.js'
import FilterIcon from '#assets/icon/Filter.svg?react'
import GlassIcon from '#components/common/icon/GlassIcon.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'
import { useCurrentUserData } from '#hooks/api/auth/useUserData.js'
import InputDebounce from '#components/common/input/InputDebounce.js'
import { StudentNeedCareModel } from '#types/Data/StudentNeedCare.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { Table, Button, Space, Breakpoint, Grid, Modal, Radio } from 'antd'
import { useCurrentSemesterData } from '#hooks/api/semester/useSemesterData.js'
import ScanStudentsModal from '#components/features/StudentNeedCare/ScanStudentsModal.js'
import { StudentNeedCareFilterRequest } from '#types/RequestModel/StudentNeedCareRequest.js'
import { useStudentNeedCareData } from '#hooks/api/studentNeedCare/useStudentNeedCareData.js'
import AddStudentCareModal from '#components/features/StudentNeedCare/AddStudentCareModal.js'
import StatisticStudentCare from '#components/features/StudentNeedCare/StatisticStudentCare.js'
import { PlusOutlined, RobotOutlined, PercentageOutlined, TeamOutlined } from '@ant-design/icons'
import StudentNeedCareFilter from '#components/features/StudentNeedCare/StudentNeedCareFilter.js'
import AssignByPercentageModal from '#components/features/StudentNeedCare/AssignByPercentageModal.js'
import useStudentNeedCareColumn from '#components/features/StudentNeedCare/ColumnTableStudentNeedCare.js'
import ProgressCriterionTypeButton from '#components/features/ProgressCriterionType/ProgressCriterionTypeButton.js'
import { useAutoAssignStudentCareMutation } from '#hooks/api/studentCareAssignment/useStudentCareAssignmentMutation.js'
import { ExportStudentCareScan } from '#components/features/StudentNeedCare/ScanStudentNeedCare/ExportStudentCareScan.js'

const { useBreakpoint } = Grid

const StudentCareDashboard: React.FC = () => {
  const { t } = useTranslation()

  const [openFilter, setOpenFilter] = useState(false)
  const [scanModalOpen, setScanModalOpen] = useState(false)
  const [searchTermDelayed, setSearchTermDelayed] = useState('')
  const [filter, setFilter] = useState<StudentNeedCareFilterRequest>({})
  const [semester, setSemester] = useState<string | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [assignByPercentageModalOpen, setAssignByPercentageModalOpen] = useState(false)
  const [assignModalVisible, setAssignModalVisible] = useState(false)
  const [assignMethod, setAssignMethod] = useState<'auto' | 'percentage'>('auto')
  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()

  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()
  const { hasPermission } = useCheckPermission()

  const hasEditPermission = hasPermission(PermissionType.WriteStudentCare)
  const hasEditCareAssignmentPermission = hasPermission(PermissionType.WriteStudentCareAssignment)

  const { data: currentUser } = useCurrentUserData()
  const { data } = useStudentNeedCareData(
    {
      query: searchTermDelayed,
      semesterName: semester,
      userId: currentUser?.roleName === RoleValue.OFFICER ? currentUser?.id : undefined,
      ...filter,
    },
    page,
    pageSize,
  )

  const { data: currentSemester } = useCurrentSemesterData()
  const { mutate: autoAssign } = useAutoAssignStudentCareMutation()

  // set semester when currentSemester has value
  useEffect(() => {
    setSemester(currentSemester?.semesterName)
  }, [currentSemester])

  const handleAutoAssign = async () => {
    autoAssign(undefined, {
      onSuccess: () => {
        toast.success(t('STUDENT_NEED_CARE.ASSIGN.SUCCESS'))
      },
      onError: (error: unknown) => {
        if (error instanceof AxiosError && error.status === 404) {
          toast.error(t('STUDENT_NEED_CARE.ASSIGN.NO_STUDENT'))
        } else {
          toast.error(t('STUDENT_NEED_CARE.ASSIGN.FAIL'))
        }
      },
    })
    setAssignModalVisible(false)
  }

  const handleOpenAssignByPercentage = () => {
    setAssignByPercentageModalOpen(true)
    setAssignModalVisible(false)
  }

  const handleAssignClick = () => {
    setAssignModalVisible(true)
  }

  const handleAssignModalOk = async () => {
    if (assignMethod === 'auto') {
      await handleAutoAssign()
    } else {
      handleOpenAssignByPercentage()
    }
  }

  const handleAssignModalCancel = () => {
    setAssignModalVisible(false)
  }

  const columns: ColumnsType<StudentNeedCareModel> = useStudentNeedCareColumn(
    screens,
    page,
    pageSize,
  )

  return (
    <div>
      <StatisticStudentCare semester={semester} setSemester={setSemester} />

      <div className={'px-6'}>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
          <InputDebounce
            value={searchTermDelayed}
            onDebouncedChange={setSearchTermDelayed}
            placeholder={t('ATTENDANCES.STUDENT_SEARCH_TERM')}
            style={{ width: 500 }}
            variant='filled'
            className='h-10 md:max-w-[300px]'
            prefix={<GlassIcon />}
          />

          <Space>
            <ExportStudentCareScan totalItems={data?.totalItems ?? 1} type='dashboard' />
            {hasEditCareAssignmentPermission && (
              <Button
                icon={<TeamOutlined />}
                type='primary'
                size='large'
                onClick={handleAssignClick}
              >
                {t('STUDENT_NEED_CARE.ASSIGN.TITLE')}
              </Button>
            )}
            <ProgressCriterionTypeButton />
            {hasEditPermission && (
              <Button
                type='primary'
                size={'large'}
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
              >
                {t('STUDENT_NEED_CARE.ADD.BUTTON')}
              </Button>
            )}
            <Button
              color='primary'
              variant='outlined'
              size='large'
              icon={<FilterIcon />}
              onClick={() => setOpenFilter(true)}
            >
              <span className='font-semibold'>{t('COMMON.FILTER')}</span>
            </Button>
          </Space>
        </Space>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={data?.items}
          scroll={{ y: '33vh' }}
          bordered
          size='large'
          pagination={{
            showQuickJumper: true,
            current: page,
            onChange: handlePageChange,
            total: data?.totalItems,
            defaultPageSize: pageSizeRef.current,
            showSizeChanger: true,
            position: ['bottomCenter'],
            showTotal: (total: number): string => t('COMMON.TOTAL_RECORDS', { total }),
            align: 'start',
          }}
        />
      </div>

      {/* Modal phân công */}
      <Modal
        title={t('STUDENT_NEED_CARE.ASSIGN.MODAL_TITLE')}
        open={assignModalVisible}
        onOk={handleAssignModalOk}
        onCancel={handleAssignModalCancel}
        okText={t('COMMON.CONFIRM')}
        cancelText={t('COMMON.CANCEL')}
      >
        <p className='mb-4'>{t('STUDENT_NEED_CARE.ASSIGN.CHOOSE_METHOD')}</p>
        <Radio.Group
          value={assignMethod}
          onChange={(e) => setAssignMethod(e.target.value)}
          className='w-full'
        >
          <div className='space-y-4'>
            <Radio.Button
              value='auto'
              className='flex items-center w-full p-4 border rounded-md'
              style={{ height: 'auto', width: '100%', textAlign: 'left' }}
            >
              <div className='flex items-center'>
                <RobotOutlined className='text-xl mr-3' />
                <div>
                  <div className='font-medium'>{t('STUDENT_NEED_CARE.ASSIGN.AUTO_DISTRIBUTE')}</div>
                  <div className='text-gray-500 text-sm'>
                    {t('STUDENT_NEED_CARE.ASSIGN.AUTO_DESCRIPTION')}
                  </div>
                </div>
              </div>
            </Radio.Button>

            <Radio.Button
              value='percentage'
              className='flex items-center w-full p-4 border rounded-md'
              style={{ height: 'auto', width: '100%', textAlign: 'left' }}
            >
              <div className='flex items-center'>
                <PercentageOutlined className='text-xl mr-3' />
                <div>
                  <div className='font-medium'>{t('STUDENT_NEED_CARE.ASSIGN.BY_PERCENTAGE')}</div>
                  <div className='text-gray-500 text-sm'>
                    {t('STUDENT_NEED_CARE.ASSIGN.BY_PERCENTAGE_DESCRIPTION')}
                  </div>
                </div>
              </div>
            </Radio.Button>
          </div>
        </Radio.Group>
      </Modal>

      <AddStudentCareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setScanModalOpen={setScanModalOpen}
      />
      <StudentNeedCareFilter
        onClose={() => setOpenFilter(false)}
        open={openFilter}
        onFilterChange={setFilter}
      />
      <ScanStudentsModal open={scanModalOpen} onClose={() => setScanModalOpen(false)} />
      <AssignByPercentageModal
        open={assignByPercentageModalOpen}
        onClose={() => setAssignByPercentageModalOpen(false)}
      />
    </div>
  )
}

export default StudentCareDashboard
