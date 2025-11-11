import { saveAs } from 'file-saver'
import dayjs, { Dayjs } from 'dayjs'
import icon from '#utils/constants/icon.js'
import type { DatePickerProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useState } from 'react'
import { Button, DatePicker, Modal, Spin } from 'antd'
import { from, mergeMap, map, toArray, lastValueFrom } from 'rxjs'
import { ApplicationList } from '#types/ResponseModel/ApiResponse.js'
import { ApplicationService } from '#src/services/ApplicationService.js'
import { applicationHeaders } from '#utils/constants/exportExcelHeaders.js'
import { useApplicationData } from '#hooks/api/application/useApplicationData.js'
import {
  DATE_FORMAT_FILE_NAME_EXPORT,
  EXPORT_API_CALL_STREAM_NUMBER,
  PAGE_SIZE_EXPORT_DIVIDED,
} from '#src/configs/WebConfig.js'

const ExcelApplication: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const { data, refetch } = useApplicationData('', '', '', 1, 10, fromDate, toDate, false)

  const handleFromDateChange: DatePickerProps['onChange'] = (date: Dayjs): void => {
    setFromDate(date.toDate())
  }

  const handleToDateChange: DatePickerProps['onChange'] = (date: Dayjs): void => {
    setToDate(date.toDate())
  }

  const handleExportFile = async (): Promise<void> => {
    try {
      setIsExporting(true)

      // Get total record
      const totalItems: number = data?.totalItems || 0
      const totalPages: number = Math.ceil(totalItems / PAGE_SIZE_EXPORT_DIVIDED)

      if (totalPages === 0) {
        setIsExporting(false)
        return
      }

      // Call api
      const allData: ApplicationList[] = await lastValueFrom(
        from(Array.from({ length: totalPages }, (_, i) => i + 1)).pipe(
          mergeMap(
            (pageNumber) =>
              ApplicationService.list({
                SearchTerm: '',
                ApplicationTypeId: '',
                DateFrom: fromDate,
                DateTo: toDate,
                Status: '',
                pageNumber,
                pageSize: PAGE_SIZE_EXPORT_DIVIDED,
              }).then((response) => response.items),
            EXPORT_API_CALL_STREAM_NUMBER,
          ),
          toArray(),
          map((pages) => pages.flat()),
        ),
      )
      if (!allData || allData.length === 0) {
        setIsExporting(false)
        return
      }

      // Send to worker
      const worker = new Worker(new URL('#utils/workers/exportExcel.worker.js', import.meta.url), {
        type: 'module',
      })

      const keysToFormat: string[] = ['returnedDate', 'receivedDate']
      worker.postMessage({
        data: allData,
        headers: applicationHeaders,
        fileName: `export_application_${dayjs().format(DATE_FORMAT_FILE_NAME_EXPORT)}.xlsx`,
        keysToFormat,
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      worker.onmessage = (event: MessageEvent<any>): void => {
        const { blob, fileName } = event.data
        saveAs(blob, fileName)
        worker.terminate()
        setIsExporting(false)
      }

      worker.onerror = (): void => {
        worker.terminate()
        setIsExporting(false)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error exporting data:', error)
      setIsExporting(false)
    }
  }

  return (
    <>
      <Button
        className='p-2 my-auto'
        size='large'
        color='default'
        variant='outlined'
        onClick={(): void => {
          setIsOpen(true)
          void refetch()
        }}
        icon={isExporting ? <Spin /> : <img src={icon.excel} alt='excel icon' />}
        disabled={isExporting} // Disable button when exporting
      >
        <span className='font-semibold'>
          {isExporting ? `${t('COMMON.LOADING')} ` : t('COMMON.EXPORT_DATA')}
        </span>
      </Button>
      <Modal
        title={<h2 className='text-2xl font-medium'>{t('COMMON.EXPORT_DATA')}</h2>}
        open={isOpen}
        onCancel={(): void => setIsOpen(false)}
        width={600}
        footer={[
          <div key='footer' className='flex gap-4 px-4 py-2'>
            <button
              onClick={(): void => setIsOpen(false)}
              className='flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
            >
              {t('COMMON.CANCEL')}
            </button>
            <button
              onClick={(): Promise<void> => handleExportFile()}
              className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
            >
              {t('COMMON.CONFIRM_DOWNLOAD_FILE')}
            </button>
          </div>,
        ]}
        className='rounded-2xl overflow-hidden'
      >
        <div className='py-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <span className='block text-sm'>
                Từ ngày <span className='text-red-500'>*</span>
              </span>
              <DatePicker
                className='w-full'
                format='DD/MM/YYYY'
                placeholder='dd/mm/yyyy'
                onChange={handleFromDateChange}
              />
            </div>
            <div className='space-y-2'>
              <label className='block text-sm'>
                Đến ngày <span className='text-red-500'>*</span>
              </label>
              <DatePicker
                className='w-full'
                format='DD/MM/YYYY'
                placeholder='dd/mm/yyyy'
                onChange={handleToDateChange}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ExcelApplication
