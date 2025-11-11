import TableApplication from '#components/features/Application/TableApplication.js'
import { Select, DatePicker, Modal, Button } from 'antd'
import React, { useEffect, useState, FC, ReactNode, Fragment } from 'react'
import {
  FilterTime,
  FilterApplication,
  ApplicationDeleteRequest,
} from '#src/types/RequestModel/ApplicationRequest.js'
import { useApplicationOptions } from '#utils/constants/Application/index.js'
import { useTranslation } from 'react-i18next'
import { convertToDateOption } from '#utils/helper/convertToDateOption.js'
import dayjs, { Dayjs } from 'dayjs'
import AddStudentApplicationModal from '#components/features/Application/AddNewStudentApllication.js'
import DeleteApplicationModal from '#components/features/Application/DeleteApplicationModal.js'
import ApplicationComponent from '#components/features/ApplicationType/ApplicationComponent.js'
import ExcelApplication from '#components/features/Application/ExcelApplication.js'
import { useApplicationDetail } from '#hooks/api/application/useApplicationData.js'
import GlassIcon from '#components/common/icon/GlassIcon.js'
import InputDebounce from '#components/common/input/InputDebounce.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'

const { RangePicker } = DatePicker

type propType = {
  fromDate: Date | undefined
  toDate: Date | undefined
}
export const Page: FC = (): ReactNode => {
  const { t } = useTranslation()

  const [searchTermDelayed, setSearchTermDelayed] = useState('')
  const [ApplicationType] = useState<FilterApplication>('')
  const [ApplicationStatus, setFilterStatus] = useState<FilterApplication>('')
  const [filterTime, setFilterTime] = useState<FilterTime>('')
  const { applicationStatusFilterTableOptions, applicationDateTableOptions } =
    useApplicationOptions()

  const [dateRange, setDateRange] = useState<propType>({ fromDate: new Date(), toDate: new Date() })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'detail' | 'edit' | 'delete' | null>(null)
  const [deleteApplicationRequest, setDeleteApplicationRequest] =
    useState<ApplicationDeleteRequest | null>(null)
  const { data: selectedApplication, isLoading } = useApplicationDetail(
    deleteApplicationRequest || { id: '' },
  )
  const [customDateRange, setCustomDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)

  const { hasPermission } = useCheckPermission()
  const hasViewPermission = hasPermission(PermissionType.ReadApplicationType)
  const hasEditApplicationPermission = hasPermission(PermissionType.WriteStudentApplication)
  const showModal = (applicationId: string, type: 'detail' | 'edit' | 'delete') => {
    setIsDeleteModalVisible(true)
    setModalType(type)
    setDeleteApplicationRequest({ id: applicationId }) // Set the userId which triggers the query
  }

  useEffect(() => {
    if (filterTime !== 'date-range') {
      const { fromDate, toDate } = convertToDateOption(filterTime)
      setDateRange({ fromDate, toDate })
    } else {
      setIsModalVisible(true) // Show the modal when 'date-range' is selected
    }
  }, [filterTime])

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null): void => {
    setCustomDateRange(dates)
  }

  const handleOk = (): void => {
    if (customDateRange?.[0] && customDateRange?.[1]) {
      setDateRange({
        fromDate: customDateRange[0].toDate(),
        toDate: customDateRange[1].toDate(),
      })
    }
    setIsModalVisible(false)
  }

  const handleCancel = (): void => {
    setIsModalVisible(false)
  }

  const handleCloseModal = (): void => {
    setIsModalVisible(false)
    setDeleteApplicationRequest(null)
    setModalType(null)
  }

  return (
    <Fragment>
      <section className='px-6 py-4 space-y-4'>
        {/* Search and Action Buttons */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div className='w-full md:w-auto flex-grow md:max-w-[600px]'>
            <InputDebounce
              value={searchTermDelayed}
              onDebouncedChange={setSearchTermDelayed}
              placeholder={t('APPLICATIONS.APPLICATION_SEARCH_TERM')}
              variant='filled'
              className='h-12 w-full rounded-lg'
              prefix={<GlassIcon />}
            />
          </div>

          <div className='flex flex-wrap gap-2 justify-start md:justify-end'>
            {hasEditApplicationPermission && <AddStudentApplicationModal />}
            <ExcelApplication />
            {hasViewPermission && <ApplicationComponent />}
          </div>
        </div>

        {/* Filters */}
        <div className='flex flex-col sm:flex-row flex-wrap gap-4 items-start justify-start'>
          {/* Filter Container - Grouped closer together */}
          <div className='flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center'>
            {/* Select for Application Date */}
            <div className='flex flex-col sm:flex-row gap-2 items-start sm:items-center'>
              <label htmlFor='ApplicationDateFilter' className='font-medium whitespace-nowrap'>
                {t('APPLICATIONS.APPLICATION_DATE')}:
              </label>
              <Select
                id='ApplicationDateFilter'
                defaultValue=''
                size='large'
                style={{ width: 200 }}
                options={applicationDateTableOptions}
                value={filterTime}
                onChange={setFilterTime}
              />
            </div>

            {/* Select for Application Status */}
            <div className='flex flex-col sm:flex-row gap-2 items-start sm:items-center'>
              <label htmlFor='ApplicationStatusFilter' className='font-medium whitespace-nowrap'>
                {t('APPLICATIONS.APPLICATION_STATUS')}:
              </label>
              <Select
                id='ApplicationStatusFilter'
                defaultValue=''
                size='large'
                style={{ width: 200 }}
                options={applicationStatusFilterTableOptions}
                value={ApplicationStatus}
                onChange={setFilterStatus}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Custom Date Range */}
      <Modal
        title={t('COMMON.SELECT_DATE_RANGE')}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key='back' onClick={handleCancel}>
            {t('COMMON.CANCEL')}
          </Button>,
          <Button key='submit' type='primary' onClick={handleOk}>
            {t('COMMON.CONFIRM')}
          </Button>,
        ]}
      >
        <RangePicker
          onChange={handleDateRangeChange}
          defaultValue={customDateRange || [dayjs(dateRange.fromDate), dayjs(dateRange.toDate)]}
        />
      </Modal>

      <div className='mt-4'>
        <TableApplication
          SearchTerm={searchTermDelayed}
          ApplicationTypeId={ApplicationType}
          DateFrom={dateRange.fromDate}
          DateTo={dateRange.toDate}
          Status={ApplicationStatus}
          showModal={showModal}
        />
        {modalType === 'delete' && hasEditApplicationPermission && (
          <DeleteApplicationModal
            isVisible={isDeleteModalVisible}
            onClose={handleCloseModal}
            staffDetails={selectedApplication}
            loading={isLoading}
          />
        )}
      </div>
    </Fragment>
  )
}
