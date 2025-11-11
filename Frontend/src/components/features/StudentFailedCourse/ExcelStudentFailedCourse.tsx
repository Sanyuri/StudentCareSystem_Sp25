import _ from 'lodash'
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'
import icon from '#utils/constants/icon.js'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useEffect, useState } from 'react'
import { Semester } from '#types/Data/Semester.js'
import { Button, InputNumber, Modal, Spin, Tooltip } from 'antd'
import { from, mergeMap, map, toArray, lastValueFrom } from 'rxjs'
import { GetAllSemesterResponse } from '#types/ResponseModel/ApiResponse.js'
import { failedStudentHeaders } from '#utils/constants/exportExcelHeaders.js'
import { StudentFailedCourseService } from '#src/services/StudentFailedCourseService.js'
import { useCurrentSemesterData, useSemesterData } from '#hooks/api/semester/useSemesterData.js'
import {
  DATE_FORMAT_FILE_NAME_EXPORT,
  EXPORT_API_CALL_STREAM_NUMBER,
  PAGE_SIZE_EXPORT_DIVIDED,
} from '#src/configs/WebConfig.js'
import {
  StudentFailedCourseExportResponse,
  StudentFailedCoursesExportListResponse,
} from '#types/ResponseModel/StudentFailedCourseResponse.js'
import { QuestionCircleOutlined } from '@ant-design/icons'

const ExcelStudentFailedCourse: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [semestersCount, setSemestersCount] = useState<number>(1)
  const [fromSemester, setFromSemester] = useState<string>('')

  const { data: currentSemester } = useCurrentSemesterData()
  const { data: semesterData } = useSemesterData()

  useEffect(() => {
    setFromSemester(currentSemester?.semesterName ?? '')
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

    // Update the fromSemester to the earliest semester we want to include
    if (newSemesterNames.length > 0) {
      setFromSemester(newSemesterNames[newSemesterNames.length - 1])
    } else {
      setFromSemester(currentSemester?.semesterName ?? '')
    }
  }

  async function processExportData(data: StudentFailedCourseExportResponse[]) {
    return _(data)
      .map((item: StudentFailedCourseExportResponse) => {
        const { studentCode, student, subjectCode, failedSemesters, passedSemesters } = item
        return {
          studentCode,
          studentName: student?.studentName || 'Unknown',
          subjectCode,
          failed: failedSemesters,
          passed: passedSemesters,
        }
      })
      .orderBy(['studentName', 'subjectCode'], ['asc', 'asc'])
      .value()
  }

  const handleExportFile = async (): Promise<void> => {
    try {
      setIsExporting(true)
      const response: StudentFailedCoursesExportListResponse =
        await StudentFailedCourseService.export({
          fromSemester: fromSemester,
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
      const allData: StudentFailedCourseExportResponse[] = await lastValueFrom(
        from(Array.from({ length: totalPages }, (_: unknown, i: number): number => i + 1)).pipe(
          mergeMap(
            (pageNumber: number): Promise<StudentFailedCourseExportResponse[]> =>
              StudentFailedCourseService.export({
                fromSemester: fromSemester,
                pageNumber,
                pageSize: PAGE_SIZE_EXPORT_DIVIDED,
              }).then(
                (
                  response: StudentFailedCoursesExportListResponse,
                ): StudentFailedCourseExportResponse[] => response.items,
              ),
            EXPORT_API_CALL_STREAM_NUMBER,
          ),
          toArray(),
          map((pages: StudentFailedCourseExportResponse[][]): StudentFailedCourseExportResponse[] =>
            pages.flat(),
          ),
        ),
      )

      if (!allData || allData.length === 0) {
        setIsExporting(false)
        return
      }

      // Process data for export
      const result = await processExportData(allData)

      // Send to worker
      const worker = new Worker(new URL('#utils/workers/exportExcel.worker.js', import.meta.url), {
        type: 'module',
      })

      worker.postMessage({
        data: result,
        headers: failedStudentHeaders,
        fileName: `export_student_failed_from_${fromSemester}_to_${dayjs().format(DATE_FORMAT_FILE_NAME_EXPORT)}.xlsx`,
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
            {t('STUDENT_FAILED_COURSE.EXPORT_SEMESTER')}
            <span className={'font-semibold'}> {currentSemester?.semesterName} </span>
            <span className={'mr-4'}>({t('STUDENT_FAILED_COURSE.EXPORT_TILL_SEMESTER')})</span>
            <Tooltip title={t('STUDENT_FAILED_COURSE.EXPORT_SEMESTER_TIP')} placement='top'>
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

export default ExcelStudentFailedCourse
