import dayjs from 'dayjs'
import { findIndex } from 'lodash'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useState } from 'react'
import { from, Observable, Subscriber } from 'rxjs'
import { Button, Checkbox, Modal, Spin } from 'antd'
import { ExportOption } from '#src/types/Data/File.js'
import ExcelIcon from '#assets/icon/Microsoft Excel.svg?react'
import { CheckboxChangeEvent } from 'antd/es/checkbox/index.js'
import { switchMap, catchError, mergeMap } from 'rxjs/operators'
import { DATE_FORMAT_FILE_NAME_EXPORT } from '#src/configs/WebConfig.js'
import { attendanceHeaders } from '#utils/constants/exportExcelHeaders.js'
import { fetchDataForItem, getPrevSemester } from '#utils/helper/attendanceExportHelper.js'
import { ExportFileResponse, StudentAttendance } from '#src/types/ResponseModel/ApiResponse.js'
import { useCurrentSemesterData, useSemesterData } from '#hooks/api/semester/useSemesterData.js'

const ExcelAttendance: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0) // Track progress
  const { data: currentSemester, isLoading: currentSemesterLoading } = useCurrentSemesterData()
  const { data: allSemesters, isLoading: prevSemesterLoading } = useSemesterData()

  const exportOptions: ExportOption[] = [
    { key: 'yesterday', label: t('ATTENDANCES.EXPORT_OPTIONS.YESTERDAY_REMINDERS') },
    { key: 'today', label: t('ATTENDANCES.EXPORT_OPTIONS.TODAY_REMINDERS') },
    {
      key: 'exceedAbsenceRate',
      label: t('ATTENDANCES.EXPORT_OPTIONS.EXCEED_ABSENCE_RATE_REMINDERS'),
    },
    { key: 'semester', label: t('ATTENDANCES.EXPORT_OPTIONS.SEMESTER_REMINDERS') },
    { key: 'year', label: t('ATTENDANCES.EXPORT_OPTIONS.YEAR_REMINDERS') },
    { key: 'engGroup', label: t('ATTENDANCES.EXPORT_OPTIONS.ENG_STUDENTS') },
    { key: 'cnGroup', label: t('ATTENDANCES.EXPORT_OPTIONS.CN_STUDENTS') },
    { key: 'prevCourse', label: t('ATTENDANCES.EXPORT_OPTIONS.PREVIOUS_COURSE_REMINDERS') },
    { key: 'updatedToday', label: t('ATTENDANCES.EXPORT_OPTIONS.UPDATED_TODAY') },
  ]

  const onSelectAll = (checked: boolean): void => {
    setSelectedItems(checked ? exportOptions.map((option: ExportOption): string => option.key) : [])
  }

  const onSelectItem = (key: string, checked: boolean): void => {
    setSelectedItems((prev: string[]): string[] =>
      checked ? [...prev, key] : prev.filter((item: string): boolean => item !== key),
    )
  }

  // Worker function to send the data for exporting
  const sendToWorker = (
    data: StudentAttendance[],
    fileName: string,
  ): Observable<ExportFileResponse> => {
    // Return an observable that manages the worker process
    return new Observable<ExportFileResponse>((observer: Subscriber<ExportFileResponse>): void => {
      const worker = new Worker(
        new URL('#utils/workers/exportExcel.worker.js', import.meta.url),
        { type: 'module' }, // Enable worker with module type
      )

      const keysToFormat: string[] = ['updatedPeriod']

      // Post message to the worker with data and fileName
      worker.postMessage({
        data,
        headers: attendanceHeaders,
        fileName: `export_attendance_${fileName}_${dayjs().format(DATE_FORMAT_FILE_NAME_EXPORT)}.xlsx`,
        keysToFormat,
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      worker.onmessage = (event: MessageEvent<any>): void => {
        const { fileName, blob } = event.data

        // Emit progress or file name to observer
        observer.next({ fileName, blob })

        // If the blob is valid, trigger file download
        if (blob instanceof Blob) {
          saveAs(blob, fileName) // Ensure blob is valid before saving
          observer.complete() // Complete observable after file download
          worker.terminate() // Terminate worker after process is complete
        }
      }

      worker.onerror = (error: ErrorEvent): void => {
        // Emit error to observer if worker fails
        observer.error(error)
        worker.terminate() // Ensure worker is terminated after error
      }
    })
  }

  const handleExportFile = (): void => {
    // Ensure there are items selected for export
    if (selectedItems.length === 0) return

    setIsExporting(true) // Set the exporting state to true
    setIsOpen(false) // Close the modal
    setProgress(0) // Reset progress before starting export
    const totalFiles = selectedItems.length // Total files to be exported
    let filesProcessed = 0 // Counter for processed files
    const currentIndex = findIndex(allSemesters, { semesterName: currentSemester?.semesterName })

    // Lấy kỳ học liền trước
    const prevSemester: string = getPrevSemester(currentIndex, allSemesters ?? [])

    from(selectedItems)
      .pipe(
        mergeMap((item: string): Observable<ExportFileResponse> => {
          // Fetch data for each item, then send it to worker for export
          return fetchDataForItem(item, currentSemester?.semesterName ?? '', prevSemester).pipe(
            switchMap((data: StudentAttendance[]): Observable<ExportFileResponse> => {
              return sendToWorker(data, item) // Send data to worker for processing
            }),
            catchError((): never[] => {
              return [] // Handle error case and return an empty array
            }),
          )
        }),
      )
      .subscribe({
        next: (): void => {
          // Update progress after each file export
          filesProcessed++

          // Calculate the export progress percentage
          const updatedProgress: number = Math.floor((filesProcessed / totalFiles) * 100)
          setProgress(updatedProgress) // Set the updated progress state
        },
        complete: (): void => {
          setIsExporting(false)
          setSelectedItems([]) // Reset selected items after export is complete
        },
      })
  }

  return (
    <>
      <Button
        size='large'
        color='default'
        variant='outlined'
        onClick={(): void => setIsOpen(true)}
        icon={isExporting ? <Spin /> : <ExcelIcon />}
        disabled={isExporting} // Disable button when exporting
      >
        <span className='font-semibold'>
          {isExporting ? `${t('COMMON.LOADING')} (${progress}%)` : t('COMMON.EXPORT_DATA')}
        </span>
      </Button>
      <Modal
        title={<h2 className='text-2xl font-medium'>{t('COMMON.EXPORT_DATA')}</h2>}
        open={isOpen}
        onCancel={(): void => setIsOpen(false)}
        width={600}
        centered
        loading={prevSemesterLoading || currentSemesterLoading}
        footer={[
          <div key='footer' className='flex gap-4 px-4 py-2'>
            <button
              onClick={(): void => setIsOpen(false)}
              className='flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
            >
              {t('COMMON.CANCEL')}
            </button>
            <button
              onClick={(): void => handleExportFile()}
              className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
            >
              {t('COMMON.CONFIRM_DOWNLOAD_FILE')}
            </button>
          </div>,
        ]}
        className='rounded-2xl overflow-hidden'
      >
        <div className='py-4'>
          <div className='mb-4'>
            <Checkbox
              onChange={(e: CheckboxChangeEvent): void => onSelectAll(e.target.checked)}
              checked={selectedItems.length === exportOptions.length}
              indeterminate={
                selectedItems.length > 0 && selectedItems.length < exportOptions.length
              }
            >
              {t('COMMON.SELECT_ALL')}
            </Checkbox>
          </div>

          <div className='space-y-3'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {exportOptions.map(
                (option: ExportOption): ReactNode => (
                  <div
                    key={option.key}
                    className='flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex items-center gap-2'>
                      <ExcelIcon />
                      <span>{option.label}</span>
                    </div>
                    <Checkbox
                      checked={selectedItems.includes(option.key)}
                      onChange={(e: CheckboxChangeEvent): void =>
                        onSelectItem(option.key, e.target.checked)
                      }
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ExcelAttendance
