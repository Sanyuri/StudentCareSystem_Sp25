import _ from 'lodash'
import dayjs from 'dayjs'
import { decode } from 'entities'
import { saveAs } from 'file-saver'
import icon from '#utils/constants/icon.js'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useEffect, useState } from 'react'
import { Semester } from '#types/Data/Semester.js'
import { Button, InputNumber, Modal, Spin, Tooltip } from 'antd'
import { from, mergeMap, map, toArray, lastValueFrom } from 'rxjs'
import { StudentDeferService } from '#src/services/DeferService.js'
import { StudentDeferModel } from '#types/Data/StudentDeferModel.js'
import { formattedSemestersFileName } from '#utils/helper/exportExcel.js'
import { deferStudentHeaders } from '#utils/constants/exportExcelHeaders.js'
import {
  GetAllSemesterResponse,
  StudentDefersListResponse,
} from '#types/ResponseModel/ApiResponse.js'
import { useCurrentSemesterData, useSemesterData } from '#hooks/api/semester/useSemesterData.js'
import {
  DATE_FORMAT_FILE_NAME_EXPORT,
  EXPORT_API_CALL_STREAM_NUMBER,
  PAGE_SIZE_EXPORT_DIVIDED,
} from '#src/configs/WebConfig.js'
import { QuestionCircleOutlined } from '@ant-design/icons'

const ExcelStudentDefer: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [semestersCount, setSemestersCount] = useState<number>(1)
  const [semesters, setSemesters] = useState<string>('')

  const { data: currentSemester } = useCurrentSemesterData()
  const { data: semesterData } = useSemesterData()

  useEffect(() => {
    setSemesters(currentSemester?.semesterName ?? '')
  }, [currentSemester])
  const handleSemesterChange = (value: number): void => {
    // Update the count of semesters
    setSemestersCount(value)

    // Find the index of the current semester
    const currentSemesterIndex: number = _.findIndex(
      semesterData,
      (item: Semester): boolean => item.semesterName === currentSemester?.semesterName,
    )

    // Filter the semester data to exclude items before the current semester
    const filteredSemesterData: GetAllSemesterResponse | undefined =
      currentSemesterIndex !== -1 ? semesterData?.slice(currentSemesterIndex) : semesterData

    // Get the list of new semester names based on the provided value
    const newSemesterNames: string[] = _.take(_.map(filteredSemesterData, 'semesterName'), value)

    // Update the semester list as a single string
    setSemesters((prevSemesters: string): string => {
      // Ensure prevSemesters is a valid string; default to an empty array if undefined
      const existingSemesters: string[] = prevSemesters ? prevSemesters.split(',') : []

      // Combine existing semesters with the new ones and remove duplicates
      const updatedSemesters: string[] = _.uniq([...existingSemesters, ...newSemesterNames])

      // Return the updated list as a comma-separated string
      return updatedSemesters.join(',')
    })
  }

  const handleExportFile = async (): Promise<void> => {
    try {
      setIsExporting(true)
      const response: StudentDefersListResponse = await StudentDeferService.list({
        query: '',
        semesters: semesters,
        pageNumber: 1,
        pageSize: 1,
      })

      setIsOpen(false)
      // Get total record
      const totalItems: number = response?.totalItems || 0
      const totalPages: number = Math.ceil(totalItems / PAGE_SIZE_EXPORT_DIVIDED)

      if (totalPages === 0) {
        setIsExporting(false)
        return
      }

      // Call api
      const allData: StudentDeferModel[] = await lastValueFrom(
        from(Array.from({ length: totalPages }, (_: unknown, i: number): number => i + 1)).pipe(
          mergeMap(
            (pageNumber: number) =>
              StudentDeferService.list({
                query: '',
                semesters: semesters,
                pageNumber,
                pageSize: PAGE_SIZE_EXPORT_DIVIDED,
              }).then((response: StudentDefersListResponse): StudentDeferModel[] => response.items),
            EXPORT_API_CALL_STREAM_NUMBER,
          ),
          toArray(),
          map((pages: StudentDeferModel[][]): StudentDeferModel[] => pages.flat()),
        ),
      )

      if (!allData || allData.length === 0) {
        setIsExporting(false)
        return
      }

      // Decode description to normal text
      const decodedData = allData.map((item: StudentDeferModel) => ({
        ...item,
        description: item.description ? decode(item.description) : item.description,
      }))
      // Send to worker
      const worker = new Worker(new URL('#utils/workers/exportExcel.worker.js', import.meta.url), {
        type: 'module',
      })

      worker.postMessage({
        data: decodedData,
        headers: deferStudentHeaders,
        fileName: `export_student_defer_${formattedSemestersFileName(semesters)}_${dayjs().format(DATE_FORMAT_FILE_NAME_EXPORT)}.xlsx`,
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
      setIsExporting(false)
    }
  }

  return (
    <>
      <Button
        size='large'
        color='default'
        variant='outlined'
        onClick={(): void => setIsOpen(true)}
        icon={isExporting ? <Spin /> : <img src={icon.excel} alt='excel icon' />}
        disabled={isExporting} // Disable button when exporting
      >
        <span className='font-semibold'>
          {isExporting ? `${t('COMMON.LOADING')}` : t('COMMON.EXPORT_DATA')}
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
        <div className='mb-4'>
          <label htmlFor='semester-select' className='block text-sm font-medium mb-2'>
            Số lượng kì cần xuất kể từ
            <span className={'font-semibold'}> {currentSemester?.semesterName} </span>
            <span className={'mr-4'}>(Tính cả kì hiện tại)</span>
            <Tooltip title='Kỳ hiện tại và các kỳ tiếp theo sẽ được xuất dựa trên số lượng bạn chọn. Ví dụ 1 sẽ chỉ xuất kì hiện tại'>
              <QuestionCircleOutlined />
            </Tooltip>
          </label>
          <InputNumber
            id='semester-select'
            value={semestersCount}
            min={1}
            onChange={(value: number | null): void => {
              if (typeof value === 'number') {
                handleSemesterChange(value)
              }
            }}
            className='w-full'
          />
        </div>
      </Modal>
    </>
  )
}

export default ExcelStudentDefer
