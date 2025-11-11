import _ from 'lodash'
import * as XLSX from 'xlsx'
import type { UploadProps } from 'antd'
import { WorkBook, WorkSheet } from 'xlsx'
import icon from '#utils/constants/icon.js'
import { useTranslation } from 'react-i18next'
import { TableRow } from '#types/Data/Note.js'
import { FC, ReactNode, useState } from 'react'
import { NoteType } from '#types/Data/NoteModel.js'
import type { RcFile } from 'antd/es/upload/interface'
import { NOTE_UPLOAD_EXAMPLE } from '#utils/constants/link.js'
import { Badge, Button, Modal, Space, Steps, Upload } from 'antd'
import { IconComponent } from '#components/common/icon/IconComponent.js'
import { DownloadOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons'
import { useNoteTypeData } from '#hooks/api/noteType/useNoteTypeData.js'
import { CreateNoteListRequest } from '#types/RequestModel/ApiRequest.js'
import { useImportFromFileMutation } from '#hooks/api/note/useNoteMutation.js'
import EditableImportNote from '#components/features/Note/ImportExcel/EditableImportNote.js'

interface FileWithProgress extends RcFile {
  percent: number
  status: 'uploading' | 'done'
}

const { Dragger } = Upload
const { Step } = Steps
const ImportExcelNote: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [fileList, setFileList] = useState<FileWithProgress[]>([])
  const [data, setData] = useState<readonly TableRow[]>([])
  const [hasUploaded, setHasUploaded] = useState<boolean>(false)
  const [countError, setCountError] = useState<number>(0)

  const { data: noteTypeList } = useNoteTypeData('')
  const { mutate: addListNote } = useImportFromFileMutation()
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: true,
    listType: 'picture',
    fileList,
    beforeUpload: async (file: RcFile): Promise<boolean> => {
      // Thêm file vào danh sách với trạng thái ban đầu
      const newFile: FileWithProgress = { ...file, percent: 0, status: 'uploading' }
      setFileList([newFile]) // Chỉ cập nhật fileList 1 lần

      let progress: number = 0
      const interval = setInterval(() => {
        progress += 20

        setFileList((prev: FileWithProgress[]) =>
          prev.map((item: FileWithProgress) =>
            item.uid === newFile.uid
              ? {
                  ...item,
                  percent: progress,
                  status: progress < 100 ? 'uploading' : 'done',
                  name: file.name,
                }
              : item,
          ),
        )

        if (progress >= 100) {
          clearInterval(interval)

          const reader = new FileReader()
          reader.onload = (event: ProgressEvent<FileReader>): void => {
            const arrayBuffer = event.target?.result as ArrayBuffer

            const binaryStr: string = new Uint8Array(arrayBuffer).reduce(
              (acc: string, byte: number): string => acc + String.fromCharCode(byte),
              '',
            )
            const workbook: WorkBook = XLSX.read(binaryStr, { type: 'binary' })
            const sheetName: string = workbook.SheetNames[0]
            const sheet: WorkSheet = workbook.Sheets[sheetName]
            const jsonData: (string | number | null | undefined)[][] = XLSX.utils.sheet_to_json(
              sheet,
              { header: 1 },
            )

            const isValidRow = (row: (string | number | null | undefined)[]): boolean => {
              return !!(row[1] && row[2] && row[3] && row[4] && row[5] && row[6])
            }

            const tableData: TableRow[] = jsonData
              .slice(1)
              .filter(isValidRow)
              .map((row: (string | number | null | undefined)[], index: number) => ({
                key: index,
                index: index + 1,
                studentCode: _.trim(_.toString(row[1])),
                studentName: _.trim(_.toString(row[2])),
                careType: _.trim(_.toString(row[3])),
                careContent: _.trim(_.toString(row[4])),
                semester: _.trim(_.toString(row[5])).replace(' ', ''),
                officer: _.trim(_.toString(row[6])),
                channel: _.trim(_.toString(row[7])),
                processingTime: _.trim(_.toString(row[8])),
              }))

            setData(tableData)
            setCurrentStep(1)
            setHasUploaded(true)
          }

          reader.readAsArrayBuffer(file)
        }
      }, 300)

      return false
    },
    onRemove: (): void => {
      setFileList([])
      setData([])
      setCurrentStep(0)
      setHasUploaded(false)
    },
    iconRender: (): ReactNode => {
      // Tùy chỉnh giao diện của từng file
      return <IconComponent src={icon.excel} alt={'Excel icon'} />
    },
    accept: '.xls,.xlsx,.csv',
  }

  const handleDownloadTemplate = (): void => {
    const newWindow: Window | null = window.open(
      NOTE_UPLOAD_EXAMPLE,
      '_blank',
      'noopener,noreferrer',
    )
    if (newWindow) newWindow.opener = null
  }

  const handleBack = (): void => {
    setCurrentStep(0)
  }

  const renderStepContent = (): ReactNode => {
    switch (currentStep) {
      case 0:
        return (
          <Dragger {...uploadProps}>
            <div className='text-center'>
              <p className='text-[40px]'>
                <InboxOutlined />
              </p>
              <p className='text-lg mb-2'>{t('NOTE.IMPORT.DRAGGER.GUIDE')}</p>
              <p className='text-gray-500 text-sm'>{t('NOTE.IMPORT.DRAGGER.MAXIMUM_SUPPORT')}</p>
              <Button color='primary' variant='outlined'>
                <span className='font-semibold'>{t('NOTE.IMPORT.DRAGGER.CHOOSE_FILE')}</span>
              </Button>
            </div>
          </Dragger>
        )
      case 1:
        return (
          <EditableImportNote dataSource={data} setData={setData} setCountError={setCountError} />
        )
      default:
        return null
    }
  }

  const handleCancel = (): void => {
    setIsOpen(false)
    setCurrentStep(0)
    setData([])
    setFileList([])
  }

  const handleSubmit = (): void => {
    const noteTypeMap: Record<string, string | null> = _.reduce(
      noteTypeList || [],
      (acc: Record<string, string | null>, type: NoteType) => {
        acc[type.vietnameseName] = type.id
        acc[type.englishName] = type.id
        return acc
      },
      {},
    )

    const createData: CreateNoteListRequest = _.map(data, (item) => ({
      studentCode: item.studentCode,
      noteTypeId: noteTypeMap[item.careType],
      semesterName: item.semester,
      entityId: null,
      content: item.careContent,
      createdBy: item.officer,
      channel: item.channel,
      processingTime: item.processingTime,
    }))

    addListNote(createData, {
      onSuccess: () => {
        setIsOpen(false)
      },
    })
  }

  return (
    <div className='ml-2'>
      <Button
        size='large'
        color='default'
        variant='outlined'
        icon={<UploadOutlined />}
        onClick={() => setIsOpen(true)}
      >
        <span className='font-semibold'>{t('NOTE.IMPORT.BUTTON')}</span>
      </Button>
      <Modal
        title={
          <div className='flex items-center'>
            <span className='text-lg font-medium'>{t('NOTE.IMPORT.MODAL.TITLE')}</span>
            <span className='text-red-500 ml-1'>*</span>
          </div>
        }
        open={isOpen}
        onCancel={handleCancel}
        footer={
          <>
            {currentStep === 0 && hasUploaded && (
              <Button type='primary' onClick={(): void => setCurrentStep(1)}>
                {t('COMMON.CONTINUE')}
              </Button>
            )}
            {currentStep === 1 && (
              <Space>
                <Button onClick={handleBack}>{t('COMMON.BACK')}</Button>
                <Button
                  type='primary'
                  variant={'outlined'}
                  onClick={handleSubmit}
                  disabled={countError !== 0}
                >
                  <Badge count={countError.toString()} offset={[10, 0]}>
                    {t('COMMON.SUBMIT')}
                  </Badge>
                </Button>
              </Space>
            )}
          </>
        }
        width={1200}
      >
        <div className='mb-4'>
          <Button
            onClick={handleDownloadTemplate}
            className='flex items-center justify-center w-full px-4 py-2'
          >
            <DownloadOutlined className='mr-2' />
            {t('COMMON.DOWNLOAD_EXCEL')}
          </Button>
        </div>
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step
            title={t('NOTE.IMPORT.STEP.FIRST')}
            description={t('NOTE.IMPORT.STEP.FIRST_DESCRIPTION')}
          />
          <Step
            title={t('NOTE.IMPORT.STEP.SECOND')}
            description={t('NOTE.IMPORT.STEP.SECOND_DESCRIPTION')}
          />
        </Steps>
        {renderStepContent()}
      </Modal>
    </div>
  )
}

export default ImportExcelNote
