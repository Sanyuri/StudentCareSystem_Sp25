import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import { CheckboxChangeEvent } from 'antd/es/checkbox/index.js'
import { Table, Checkbox, Button, Input, Modal, Tag } from 'antd'
import { useAddSubjectData } from '#hooks/api/subject/useSubjectData.js'
import { SubjectResponse } from '#src/types/ResponseModel/SubjectResponse.js'
import { useAddSubjectMutation } from '#hooks/api/subject/useSubjectMutation.js'
import { useState, useEffect, useCallback, FC, ReactNode, ChangeEvent } from 'react'
import AddIcon from '#assets/icon/Add.svg?react'

const AddSubject: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState<SubjectResponse[]>([])
  const [searchText, setSearchText] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [hasMore, setHasMore] = useState(true) // Flag to control if there's more data
  const [loadingMore, setLoadingMore] = useState(false) // Flag to track loading state
  const [loadedCourses, setLoadedCourses] = useState<SubjectResponse[]>([])

  const { data, isFetching } = useAddSubjectData(searchText, pageNumber, 10)
  const { mutate: addSubject } = useAddSubjectMutation()

  useEffect(() => {
    setPageNumber(1) // Reset pageNumber when searchText changes
    setLoadedCourses([]) // Reset loaded courses when searchText changes
  }, [searchText])

  const handleTableScroll = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      const target = e.target as HTMLElement
      const isBottom: boolean = target.scrollHeight === target.scrollTop + target.clientHeight

      if (isBottom && !isFetching && hasMore && !loadingMore) {
        setLoadingMore(true) // Set loadingMore to true to avoid multiple API calls
        setPageNumber((prev: number): number => prev + 1) // Increase pageNumber when scrolling to the bottom
      }
    },
    [isFetching, hasMore, loadingMore],
  )

  useEffect(() => {
    const courses: SubjectResponse[] = data?.items || []
    const totalItems: number = data?.totalItems || 0

    if (courses.length === 0) return // No courses, don't do anything

    // If all data has been loaded, set hasMore to false
    if (courses.length < 10 || courses.length === totalItems) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }

    setLoadingMore(false)

    // Update loadedCourses with unique subjects
    setLoadedCourses((prev: SubjectResponse[]): SubjectResponse[] => {
      const newCourses: SubjectResponse[] = courses.filter(
        (course: SubjectResponse): boolean =>
          !prev.some(
            (existingCourse: SubjectResponse): boolean =>
              existingCourse.subjectCode === course.subjectCode,
          ),
      )
      return [...prev, ...newCourses] // Add only unique courses
    })
  }, [data?.items, data?.totalItems])

  const handleSubmit = (): void => {
    const studentSubjectIds: string[] = selectedCourses.map(
      (course: SubjectResponse): string => course.id,
    ) // Collect subject IDs
    addSubject(
      { studentSubjectIds },
      {
        onSuccess: (): void => {
          setSelectedCourses([]) // Clear selected courses
          setLoadedCourses([]) // Clear loaded courses
          setIsModalOpen(false) // Close the modal
        },
      },
    )
  }

  const columns: ColumnsType<SubjectResponse> = [
    {
      title: '',
      key: 'selection',
      width: 30,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: SubjectResponse): ReactNode => (
        <Checkbox
          checked={selectedCourses.some((course) => course.subjectCode === record.subjectCode)}
          onChange={(e: CheckboxChangeEvent): void => {
            const course: SubjectResponse = record
            if (e.target.checked) {
              setSelectedCourses((prevCourses: SubjectResponse[]): SubjectResponse[] => {
                if (
                  !prevCourses.some(
                    (c: SubjectResponse): boolean => c.subjectCode === course.subjectCode,
                  )
                ) {
                  return [...prevCourses, course]
                }
                return prevCourses
              })
            } else {
              setSelectedCourses((prevCourses: SubjectResponse[]): SubjectResponse[] =>
                prevCourses.filter(
                  (course: SubjectResponse): boolean => course.subjectCode !== record.subjectCode,
                ),
              )
            }
          }}
        />
      ),
    },
    {
      title: t('SUBJECT.TABLE_COLUMN.SUBJECT_CODE'),
      dataIndex: 'subjectCode',
      key: 'subjectCode',
      width: 80,
    },
    {
      title: t('SUBJECT.TABLE_COLUMN.VIETNAMESE_SUBJECT_NAME'),
      dataIndex: 'vietnameseName',
      key: 'vietnameseName',
      width: 120,
    },
    {
      title: t('SUBJECT.TABLE_COLUMN.ENGLISH_SUBJECT_NAME'),
      dataIndex: 'englishName',
      key: 'englishName',
      width: 120,
    },
    {
      title: t('SUBJECT.TABLE_COLUMN.SUBJECT_GROUP'),
      dataIndex: 'subjectGroup',
      key: 'subjectGroup',
      width: 100,
    },
  ]

  return (
    <>
      <Button
        color='primary'
        variant='solid'
        size='large'
        icon={<AddIcon />}
        onClick={() => setIsModalOpen(true)}
      >
        <span className='font-semibold'>{t('SUBJECT.ADD_SUBJECT')}</span>
      </Button>

      <Modal
        title={t('SUBJECT.ADD_SUBJECT')}
        open={isModalOpen}
        onCancel={(): void => setIsModalOpen(false)}
        width={1000}
        footer={[
          <Button key='cancel' onClick={(): void => setIsModalOpen(false)}>
            Hủy bỏ
          </Button>,
          <Button
            key='submit'
            type='primary'
            disabled={selectedCourses.length === 0}
            onClick={handleSubmit}
          >
            Xác nhận ({selectedCourses.length})
          </Button>,
        ]}
      >
        <div className='flex items-center gap-4 mb-4'>
          <Input
            style={{ width: 500 }}
            placeholder={t('SUBJECT.TEMPLATE_SEARCH_TERM')}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e: ChangeEvent<HTMLInputElement>): void => setSearchText(e.target.value)} // Update searchText
          />
        </div>

        {selectedCourses.length > 0 && (
          <div className='mb-4'>
            <span style={{ color: 'rgba(0, 0, 0, 0.45)', marginRight: 8, fontSize: 14 }}>
              {selectedCourses.length} {t('SUBJECT.SELECT_SUBJECT')}
            </span>
            {selectedCourses.map(
              (course: SubjectResponse): ReactNode => (
                <Tag
                  key={`${course.id}`}
                  closable
                  onClose={(): void => {
                    setSelectedCourses(
                      selectedCourses.filter((c: SubjectResponse): boolean => c.id !== course.id),
                    )
                  }}
                  style={{ marginRight: 8 }}
                >
                  {course.subjectCode}
                </Tag>
              ),
            )}
          </div>
        )}

        <Table
          columns={columns}
          dataSource={loadedCourses}
          pagination={false}
          scroll={{ y: 400 }}
          rowKey='subjectCode'
          loading={isFetching || loadingMore}
          onScroll={handleTableScroll}
        />
      </Modal>
    </>
  )
}
export default AddSubject
