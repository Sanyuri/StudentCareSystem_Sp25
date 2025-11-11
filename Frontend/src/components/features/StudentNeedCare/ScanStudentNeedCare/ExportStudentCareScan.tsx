import {
  DATE_FORMAT_FILE_NAME_EXPORT,
  EXPORT_API_CALL_STREAM_NUMBER,
  PAGE_SIZE_EXPORT_DIVIDED,
} from '#src/configs/WebConfig.js'
import { StudentNeedCateService } from '#src/services/StudentNeedCateService.js'
import { StudentNeedCareModel } from '#src/types/Data/StudentNeedCare.js'
import { studentCareHeaders } from '#utils/constants/exportExcelHeaders.js'
import { Button, Checkbox, Modal, Select, Spin } from 'antd'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { from, lastValueFrom, map, mergeMap, toArray } from 'rxjs'
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'
import ExcelIcon from '#assets/icon/Microsoft Excel.svg?react'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { ExportOption } from '#src/types/Data/File.js'
import { useCurrentSemesterData, useSemesterData } from '#hooks/api/semester/useSemesterData.js'
import { toast } from 'react-toastify'

interface ExportStudentCareScanProps {
  totalItems: number
  type: 'scanned' | 'dashboard'
}

export const ExportStudentCareScan: FC<ExportStudentCareScanProps> = ({
  totalItems,
  type,
}: ExportStudentCareScanProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [selectedSemester, setSelectedSemester] = useState<string>()

  const { data: semesterData } = useSemesterData()
  const { data: currentSemesterData } = useCurrentSemesterData()

  useEffect(() => {
    setSelectedSemester(currentSemesterData?.semesterName)
  }, [currentSemesterData])
  const exportOptions: ExportOption[] = [
    {
      key: 'scanned',
      label:
        type === 'dashboard'
          ? t('STUDENT_NEED_CARE.EXPORT.OPTIONS.ALL')
          : t('STUDENT_NEED_CARE.EXPORT.OPTIONS.SCANNED'),
    },
  ]

  const onSelectAll = (checked: boolean): void => {
    setSelectedItems(checked ? exportOptions.map((option: ExportOption): string => option.key) : [])
  }

  const onSelectItem = (key: string, checked: boolean): void => {
    setSelectedItems((prev: string[]): string[] =>
      checked ? [...prev, key] : prev.filter((item: string): boolean => item !== key),
    )
  }

  const handleExportFile = async (): Promise<void> => {
    try {
      // Ensure there are items selected for export
      if (selectedItems.length === 0) return

      setIsExporting(true)
      setIsOpen(false)
      setProgress(0)

      const totalFiles = selectedItems.length
      let filesProcessed = 0

      // Get total record
      const totalPages: number = Math.ceil(totalItems / PAGE_SIZE_EXPORT_DIVIDED)

      if (totalPages === 0) {
        setIsExporting(false)
        toast.error(t('COMMON.NO_DATA'))
        return
      }

      await exportScannedStudents(totalPages)

      filesProcessed++
      const updatedProgress: number = Math.floor((filesProcessed / totalFiles) * 100)
      setProgress(updatedProgress)

      setIsExporting(false)
      setSelectedItems([])
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error exporting data:', error)
      setIsExporting(false)
    }
  }

  const fetchPaginatedData = async <T,>(
    fetchFunction: (params: { pageNumber: number; pageSize: number }) => Promise<{ items: T[] }>,
    totalPages: number,
  ): Promise<T[]> => {
    return lastValueFrom(
      from(Array.from({ length: totalPages }, (_, i) => i + 1)).pipe(
        mergeMap(
          (pageNumber) =>
            fetchFunction({
              ...(type === 'dashboard' ? { semesterName: selectedSemester } : {}),
              pageNumber,
              pageSize: PAGE_SIZE_EXPORT_DIVIDED,
            }).then((response) => response.items),
          EXPORT_API_CALL_STREAM_NUMBER,
        ),
        toArray(),
        map((pages) => pages.flat()),
      ),
    )
  }

  const exportScannedStudents = async (totalPages: number): Promise<void> => {
    // Call API based on type
    const allData: StudentNeedCareModel[] = await fetchPaginatedData(
      type === 'dashboard' ? StudentNeedCateService.list : StudentNeedCateService.scanList,
      totalPages,
    )

    if (!allData || allData.length === 0) {
      return
    }

    // Send to worker
    const worker = new Worker(new URL('#utils/workers/exportExcel.worker.js', import.meta.url), {
      type: 'module',
    })

    const keysToFormat: string[] = ['returnedDate', 'receivedDate']
    const fileName =
      type === 'dashboard'
        ? `export_dashboard_students_${selectedSemester}_${dayjs().format(DATE_FORMAT_FILE_NAME_EXPORT)}.xlsx`
        : `export_scanned_students_${dayjs().format(DATE_FORMAT_FILE_NAME_EXPORT)}.xlsx`

    worker.postMessage({
      data: allData,
      headers: studentCareHeaders,
      fileName,
      keysToFormat,
    })

    return new Promise((resolve, reject) => {
      worker.onmessage = (event: MessageEvent<{ blob: Blob; fileName: string }>): void => {
        const { blob, fileName } = event.data
        saveAs(blob, fileName)
        worker.terminate()
        resolve()
      }

      worker.onerror = (error): void => {
        worker.terminate()
        reject(new Error(error.message || 'Export failed'))
      }
    })
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
        }}
        icon={isExporting ? <Spin /> : <ExcelIcon />}
        disabled={isExporting}
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
              disabled={selectedItems.length === 0}
            >
              {t('COMMON.CONFIRM_DOWNLOAD_FILE')}
            </button>
          </div>,
        ]}
        className='rounded-2xl overflow-hidden'
      >
        <div className='py-4'>
          {type === 'dashboard' && (
            <div className='mb-6'>
              <label className='block mb-2 font-medium'>{t('COMMON.SELECT_SEMESTER')}</label>
              <Select
                className='w-full'
                value={selectedSemester}
                onChange={(value: string): void => setSelectedSemester(value)}
                options={[
                  ...(semesterData || []).map((semester) => ({
                    value: semester.semesterName,
                    label: semester.semesterName,
                  })),
                ]}
              />
            </div>
          )}

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
            <div className='grid grid-cols-1 gap-4'>
              {exportOptions.map(
                (option: ExportOption): ReactNode => (
                  <div
                    key={option.key}
                    className='flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex items-center gap-2'>
                      <ExcelIcon className='text-green-600' />
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
