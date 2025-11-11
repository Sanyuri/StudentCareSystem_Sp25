import { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { saveAs } from 'file-saver'
import { HistoryOutlined, FileExcelOutlined } from '@ant-design/icons'
import usePagination from '#hooks/usePagination.js'
import { Breakpoint, Card, Grid, Table, Button } from 'antd'
import { FC, Fragment, ReactNode, useState } from 'react'
import StudentCareHistoryModal from './StudentCareHistoryModal'
import { StudentNeedCareModel } from '#src/types/Data/StudentNeedCare.js'
import useStudentCareHistoryColumn from './ColumnTableStudentCareHistory'
import { useStudentNeedCareData } from '#hooks/api/studentNeedCare/useStudentNeedCareData.js'
import { toast } from 'react-toastify'
import { ProgressCriteriaService } from '#src/services/ProgressCriteriaService.js'
import { useProgressCriterionTypeData } from '#hooks/api/progressCriterionType/useProgressCriterionTypeData.js'
import { HeaderFile } from '#src/types/Data/HeaderFile.js'

const { useBreakpoint } = Grid

interface StudentCareHistoryProps {
  studentId: string
}

const StudentCareHistory: FC<StudentCareHistoryProps> = ({
  studentId,
}: StudentCareHistoryProps): ReactNode => {
  const { t } = useTranslation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRating, setCurrentRating] = useState<StudentNeedCareModel | undefined>(undefined)
  const [isExporting, setIsExporting] = useState(false)

  const screens: Partial<Record<Breakpoint, boolean>> = useBreakpoint()
  const { page, pageSize, pageSizeRef, handlePageChange } = usePagination()

  const { data: criteriaTypes } = useProgressCriterionTypeData()
  const { data: careHistoryData, isLoading } = useStudentNeedCareData(
    { query: studentId },
    page,
    pageSize,
  )

  const handleViewDetail = (record: StudentNeedCareModel): void => {
    setCurrentRating(record)
    setIsModalOpen(true)
  }

  const columns: ColumnsType<StudentNeedCareModel> = useStudentCareHistoryColumn(
    screens,
    page,
    pageSize,
    handleViewDetail,
  )

  // Hàm xuất dữ liệu ra file Excel sử dụng worker
  const exportToExcel = async () => {
    if (!careHistoryData?.items || careHistoryData.items.length === 0) {
      toast.warning(t('COMMON.NO_DATA_TO_EXPORT'))
      return
    }

    try {
      setIsExporting(true)

      const exportItems = await Promise.all(
        careHistoryData.items.map(async (item, index) => {
          const criteriaData = await ProgressCriteriaService.getByStudentCare(item.id)

          const exportItem = {
            STT: index + 1,
            [t('STUDENT_NEED_CARE.TABLE.STUDENT_CODE')]: item.studentCode,
            [t('STUDENT_NEED_CARE.TABLE.STUDENT_NAME')]: item.student.studentName,
            [t('STUDENT_NEED_CARE.TABLE.NEED_CARE_NEXT_TERM')]: item.needsCareNextTerm
              ? 'Có'
              : 'Không',
            [t('STUDENT_NEED_CARE.TABLE.IS_PROGRESSING')]: item.isProgressing ? 'Có' : 'Không',
            [t('STUDENT_NEED_CARE.TABLE.IS_COLLABORATING')]: item.isCollaborating ? 'Có' : 'Không',
            [t('STUDENT_NEED_CARE.TABLE.CARE_STATUS')]: item.careStatus,
            [t('STUDENT_NEED_CARE.TABLE.FINAL_COMMENT')]: item.finalComment || '',
          }

          if (criteriaData && criteriaData.length > 0) {
            criteriaData.forEach((criteria) => {
              if (criteria.progressCriterionTypeId) {
                const criterionType = criteriaTypes?.find(
                  (type) => type.id === criteria.progressCriterionTypeId,
                )

                // Sử dụng thông tin từ criteriaTypes nếu có, nếu không thì sử dụng từ criteria
                const vietnameseName = criterionType?.vietnameseName || ''
                const englishName = criterionType?.englishName || ''

                const criteriaName = `${vietnameseName} (${englishName})`
                exportItem[criteriaName] = criteria.score
              }
            })
          }

          return exportItem
        }),
      )

      // Tạo headers động dựa trên dữ liệu
      const dynamicHeaders: HeaderFile[] = []
      dynamicHeaders.push({ header: 'STT', key: 'STT' })
      dynamicHeaders.push({
        header: t('STUDENT_NEED_CARE.TABLE.STUDENT_CODE'),
        key: t('STUDENT_NEED_CARE.TABLE.STUDENT_CODE'),
      })
      dynamicHeaders.push({
        header: t('STUDENT_NEED_CARE.TABLE.STUDENT_NAME'),
        key: t('STUDENT_NEED_CARE.TABLE.STUDENT_NAME'),
      })
      dynamicHeaders.push({
        header: t('STUDENT_NEED_CARE.TABLE.NEED_CARE_NEXT_TERM'),
        key: t('STUDENT_NEED_CARE.TABLE.NEED_CARE_NEXT_TERM'),
      })
      dynamicHeaders.push({
        header: t('STUDENT_NEED_CARE.TABLE.IS_PROGRESSING'),
        key: t('STUDENT_NEED_CARE.TABLE.IS_PROGRESSING'),
      })
      dynamicHeaders.push({
        header: t('STUDENT_NEED_CARE.TABLE.IS_COLLABORATING'),
        key: t('STUDENT_NEED_CARE.TABLE.IS_COLLABORATING'),
      })
      dynamicHeaders.push({
        header: t('STUDENT_NEED_CARE.TABLE.CARE_STATUS'),
        key: t('STUDENT_NEED_CARE.TABLE.CARE_STATUS'),
      })
      dynamicHeaders.push({
        header: t('STUDENT_NEED_CARE.TABLE.FINAL_COMMENT'),
        key: t('STUDENT_NEED_CARE.TABLE.FINAL_COMMENT'),
      })

      if (exportItems.length > 0) {
        const firstItem = exportItems[0]
        Object.keys(firstItem).forEach((key) => {
          if (!dynamicHeaders.some((h) => h.key === key)) {
            dynamicHeaders.push({ header: key, key: key })
          }
        })
      }

      const worker = new Worker(new URL('#utils/workers/exportExcel.worker.js', import.meta.url), {
        type: 'module',
      })
      worker.postMessage({
        data: exportItems,
        headers: dynamicHeaders,
        fileName: `StudentCareHistory_${new Date().toISOString().split('T')[0]}.xlsx`,
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
      toast.error(t('COMMON.EXPORT_ERROR'))
      setIsExporting(false)
    }
  }

  return (
    <Fragment>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <HistoryOutlined style={{ marginRight: '8px' }} />
              <span>{t('STUDENT_NEED_CARE.HISTORY.TITLE')}</span>
            </div>
            <Button
              type='primary'
              icon={<FileExcelOutlined />}
              onClick={exportToExcel}
              loading={isExporting || isLoading}
              className='bg-green-600 hover:bg-green-700 text-white flex items-center'
              style={{
                borderRadius: '6px',
                border: 'none',
                boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
              }}
            >
              {t('COMMON.EXPORT_EXCEL')}
            </Button>
          </div>
        }
        style={{
          width: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
        }}
      >
        <Table
          loading={isLoading}
          rowKey='id'
          bordered
          size='large'
          columns={columns}
          scroll={{ y: '48vh' }}
          sticky={{ offsetHeader: 64 }}
          pagination={{
            current: page,
            onChange: handlePageChange,
            total: careHistoryData?.totalItems,
            defaultPageSize: pageSizeRef.current,
            showSizeChanger: true,
            position: ['bottomCenter'],
            showTotal: (total: number): string => t('COMMON.TOTAL_RECORDS', { total }),
            align: 'start',
          }}
          dataSource={careHistoryData?.items}
        />
      </Card>

      <StudentCareHistoryModal
        currentRating={currentRating}
        isModalOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </Fragment>
  )
}

export default StudentCareHistory
