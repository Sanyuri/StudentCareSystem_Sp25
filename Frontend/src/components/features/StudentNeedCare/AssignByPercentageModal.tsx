import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import React, { useState, useEffect } from 'react'
import { RoleValue } from '#utils/constants/role.js'
import { useAccountData } from '#hooks/api/account/useAccountData.js'
import { Modal, Form, InputNumber, Button, Table, Divider } from 'antd'
import { FilterStatus } from '#src/types/RequestModel/AccountListRequest.js'
import { StudentCareAssignmentPercentRequest } from '#src/types/RequestModel/StudentCareAssignment.js'
import { useAutoAssignPercentStudentCareMutation } from '#hooks/api/studentCareAssignment/useStudentCareAssignmentMutation.js'
import { AxiosError } from 'axios'

interface AssignByPercentageModalProps {
  open: boolean
  onClose: () => void
}

interface StaffPercentage {
  staffId: string
  percentage: number
  name: string
}

const AssignByPercentageModal: React.FC<AssignByPercentageModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const [staffPercentages, setStaffPercentages] = useState<StaffPercentage[]>([])
  const [totalPercentage, setTotalPercentage] = useState(0)

  const { data: careOfficers } = useAccountData('active' as FilterStatus, RoleValue.OFFICER)

  const { mutateAsync: assignByPercentage, isPending } = useAutoAssignPercentStudentCareMutation()

  useEffect(() => {
    if (careOfficers?.items) {
      const initialStaffPercentages = careOfficers.items.map((staff) => ({
        staffId: staff.id,
        name: staff.fullName,
        percentage: 0,
      }))
      setStaffPercentages(initialStaffPercentages)
    }
  }, [careOfficers])

  useEffect(() => {
    const total = staffPercentages.reduce((sum, staff) => sum + (staff.percentage || 0), 0)
    setTotalPercentage(total)
  }, [staffPercentages])

  const handlePercentageChange = (value: number | null, staffId: string) => {
    setStaffPercentages((prev) =>
      prev.map((staff) =>
        staff.staffId === staffId ? { ...staff, percentage: value || 0 } : staff,
      ),
    )
  }

  const handleSubmit = async () => {
    if (totalPercentage !== 100) {
      toast.error(t('STUDENT_NEED_CARE.ASSIGN.PERCENTAGE_ERROR'))
      return
    }

    const assignByPercentageData: StudentCareAssignmentPercentRequest = {
      userPercentages: staffPercentages.map((staff) => ({
        userId: staff.staffId,
        percentage: staff.percentage / 100,
      })),
    }
    await assignByPercentage(assignByPercentageData, {
      onSuccess: () => {
        toast.success(t('STUDENT_NEED_CARE.ASSIGN.SUCCESS'))
        onClose()
      },
      onError: (error: unknown) => {
        if (error instanceof AxiosError && error.status === 404) {
          toast.error(t('STUDENT_NEED_CARE.ASSIGN.NO_STUDENT'))
        } else {
          toast.error(t('STUDENT_NEED_CARE.ASSIGN.FAIL'))
        }
      },
    })
  }

  const columns = [
    {
      title: t('STUDENT_NEED_CARE.ASSIGN.STAFF_NAME'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('STUDENT_NEED_CARE.ASSIGN.PERCENTAGE'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (_: unknown, record: StaffPercentage) => (
        <InputNumber
          min={0}
          max={100}
          value={record.percentage}
          onChange={(value) => handlePercentageChange(value, record.staffId)}
          formatter={(value) => `${value}%`}
          parser={(value) => Number(value!.replace('%', ''))}
        />
      ),
    },
  ]

  return (
    <Modal
      title={t('STUDENT_NEED_CARE.ASSIGN.BY_PERCENTAGE_TITLE')}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form form={form} layout='vertical'>
        <Table
          dataSource={staffPercentages}
          columns={columns}
          rowKey='staffId'
          pagination={false}
          size='middle'
        />

        <Divider />

        <div className='flex justify-between items-center mb-4'>
          <div className='text-lg font-semibold'>
            {t('STUDENT_NEED_CARE.ASSIGN.TOTAL')}: {totalPercentage}%
          </div>
          <div className={totalPercentage === 100 ? 'text-green-500' : 'text-red-500'}>
            {totalPercentage === 100
              ? t('STUDENT_NEED_CARE.ASSIGN.VALID_PERCENTAGE')
              : t('STUDENT_NEED_CARE.ASSIGN.INVALID_PERCENTAGE')}
          </div>
        </div>

        <div className='flex justify-end gap-2'>
          <Button onClick={onClose}>{t('COMMON.CANCEL')}</Button>
          <Button
            type='primary'
            onClick={handleSubmit}
            disabled={totalPercentage !== 100}
            loading={isPending}
          >
            {t('COMMON.CONFIRM')}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default AssignByPercentageModal
