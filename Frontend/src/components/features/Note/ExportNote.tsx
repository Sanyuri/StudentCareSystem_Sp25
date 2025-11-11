import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useState } from 'react'
import { from, Observable, Subscriber } from 'rxjs'
import { Button, Checkbox, DatePicker, Modal, Select, Spin } from 'antd'
import { ExportOption } from '#src/types/Data/File.js'
import ExcelIcon from '#assets/icon/Microsoft Excel.svg?react'
import { CheckboxChangeEvent } from 'antd/es/checkbox/index.js'
import { switchMap, catchError, mergeMap } from 'rxjs/operators'
import { DATE_FORMAT_FILE_NAME_EXPORT } from '#src/configs/WebConfig.js'
import { ExportFileResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { useNoteTypeData } from '#hooks/api/noteType/useNoteTypeData.js'
import { noteHeaders } from '#utils/constants/exportExcelHeaders.js'
import { NoteModel } from '#src/types/Data/NoteModel.js'
import dayjs from 'dayjs'
import { useSemesterData } from '#hooks/api/semester/useSemesterData.js'
import { fetchNoteDataForItem } from '#utils/helper/noteExportHelper.js'
const { RangePicker } = DatePicker

const ExportNote: FC = (): ReactNode => {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0) // Track progress
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null)

  const { data: semesterData } = useSemesterData()
  const { data: noteTypes, isLoading: noteTypesLoading } = useNoteTypeData('')

  // Tạo danh sách các option từ các loại ghi chú
  const exportOptions: ExportOption[] =
    noteTypes?.map((noteType) => ({
      key: noteType.id,
      label: i18n.language === 'en' ? noteType.englishName : noteType.vietnameseName,
    })) || []

  const onSelectAll = (checked: boolean): void => {
    setSelectedItems(checked ? exportOptions.map((option: ExportOption): string => option.key) : [])
  }

  const onSelectItem = (key: string, checked: boolean): void => {
    setSelectedItems((prev: string[]): string[] =>
      checked ? [...prev, key] : prev.filter((item: string): boolean => item !== key),
    )
  }

  // Worker function to send the data for exporting
  const sendToWorker = (data: NoteModel[], fileName: string): Observable<ExportFileResponse> => {
    // Return an observable that manages the worker process
    return new Observable<ExportFileResponse>((observer: Subscriber<ExportFileResponse>): void => {
      const worker = new Worker(
        new URL('#utils/workers/exportExcel.worker.js', import.meta.url),
        { type: 'module' }, // Enable worker with module type
      )

      const keysToFormat: string[] = ['createdAt']

      // Post message to the worker with data and fileName
      worker.postMessage({
        data,
        headers: noteHeaders,
        fileName: `export_note_${fileName}_${dayjs().format(DATE_FORMAT_FILE_NAME_EXPORT)}.xlsx`,
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

    // Lấy tất cả các ID của note types để truyền vào hàm fetchDataForItem
    const noteTypeIds = noteTypes?.map((item) => item.id) || []

    // Chuẩn bị tham số cho API
    const params = {
      semesterName: selectedSemester,
      fromDate: dateRange?.[0]?.format('YYYY-MM-DD'),
      toDate: dateRange?.[1]?.format('YYYY-MM-DD'),
    }

    from(selectedItems)
      .pipe(
        mergeMap((item: string): Observable<ExportFileResponse> => {
          // Fetch data for each item, then send it to worker for export
          return fetchNoteDataForItem(item, noteTypeIds, params).pipe(
            switchMap((data: NoteModel[]): Observable<ExportFileResponse> => {
              // Tìm tên của note type để đặt tên file
              const noteTypeName = noteTypes?.find((nt) => nt.id === item)?.vietnameseName || item
              return sendToWorker(data, noteTypeName) // Send data to worker for processing
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
        title={<h2 className='text-2xl font-medium dark:text-white'>{t('COMMON.EXPORT_DATA')}</h2>}
        open={isOpen}
        onCancel={(): void => setIsOpen(false)}
        width={600}
        centered
        loading={noteTypesLoading}
        footer={[
          <div key='footer' className='flex gap-4 px-4 py-2'>
            <Button
              onClick={(): void => setIsOpen(false)}
              className='flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white'
            >
              {t('COMMON.CANCEL')}
            </Button>
            <Button
              onClick={(): void => handleExportFile()}
              className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
            >
              {t('COMMON.CONFIRM_DOWNLOAD_FILE')}
            </Button>
          </div>,
        ]}
        className='rounded-2xl overflow-hidden'
      >
        <div className='py-4 dark:text-white'>
          {/* Add select chọn kì học */}
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2 dark:text-gray-300'>
              {t('COMMON.SELECT_SEMESTER')}
            </label>
            <Select
              placeholder={t('COMMON.SELECT_SEMESTER_PLACEHOLDER')}
              className='w-full'
              options={semesterData?.map((semester) => ({
                label: semester.semesterName,
                value: semester.semesterName,
              }))}
              onChange={(value: string) => setSelectedSemester(value)}
              allowClear
            />
          </div>

          {/* Add date time picker */}
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2 dark:text-gray-300'>
              {t('COMMON.SELECT_DATE_RANGE')}
            </label>
            <RangePicker
              className='w-full'
              format='DD/MM/YYYY'
              placeholder={[t('COMMON.START_DATE'), t('COMMON.END_DATE')]}
              onChange={(dates) => setDateRange(dates)}
              allowClear
            />
          </div>

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
                    className='flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
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

export default ExportNote
