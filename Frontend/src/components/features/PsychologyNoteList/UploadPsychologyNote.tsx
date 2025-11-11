import { useGoogleDriveMutation } from '#hooks/api/googleDrive/useGoogleDriveMuration.js'
import { usePsychologyNoteData } from '#hooks/api/psychologyNotes/usePsychologyNoteData.js'
import { useUpdateDriveFileMutation } from '#hooks/api/psychologyNotes/usePsychologyNoteMutation.js'
import { useCurrentSemesterData } from '#hooks/api/semester/useSemesterData.js'
import { SemesterNote } from '#src/types/Data/PsychologyNote.js'
import { StudentModel } from '#src/types/Data/StudentModel.js'
import { UpdateDriveFilePsychologyNoteRequest } from '#src/types/RequestModel/ApiRequest.js'
import { DriveRequest } from '#src/types/RequestModel/DriveRequest.js'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import { AxiosError } from 'axios'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

interface UploadPsychologyNoteProps {
  id: string
  notes: SemesterNote[]
  studentInfo: StudentModel | undefined
  note: SemesterNote
}

const UploadPsychologyNote: FC<UploadPsychologyNoteProps> = ({
  id,
  note,
  notes,
  studentInfo,
}: UploadPsychologyNoteProps): ReactNode => {
  const { t } = useTranslation()

  const { data: currentSemester } = useCurrentSemesterData()
  const { refetch: refetchPsychologyNote } = usePsychologyNoteData(id)

  const { mutateAsync: updateNoteDriveUrlMutation } = useUpdateDriveFileMutation()
  const { mutateAsync: uploadGoogleDrive } = useGoogleDriveMutation()

  const handleUploadFile = async (file: File, noteId: string) => {
    const currentNote = notes.find((note) => note.id === noteId)

    const createFolderData: DriveRequest = {
      dataReq: {
        data: await fileToBase64(file),
        name: file.name,
        type: file.type,
        token: '',
        isSystem: true,
        subFolder: `${currentSemester?.semesterName}/${studentInfo?.studentCode}/${currentNote?.subject}`,
        parentId: '',
      },
      fname: 'uploadFilesToGoogleDrive',
    }

    await uploadGoogleDrive(createFolderData, {
      onSuccess: (response) => {
        const updatePsychologyFolder: UpdateDriveFilePsychologyNoteRequest = {
          id: noteId,
          driveUrl: response.currentFolderUrl,
        }
        void updateNoteDriveUrlMutation(updatePsychologyFolder, {
          onSuccess: () => {
            void refetchPsychologyNote()
          },
          onError: (error: unknown) => {
            if (error instanceof AxiosError && error.status === 413) {
              toast.error(t('STUDENT_PSYCHOLOGY.TOAST.ERROR.UPLOAD'))
            } else {
              toast.error(t('COMMON.ERROR'))
            }
          },
        })
      },
    })
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1]
          resolve(base64String)
        } else {
          reject(new Error(t('SEMESTER_NOTES.TOAST.FAIL_BASE_64')))
        }
      }
      reader.onerror = () => reject(new Error(t('SEMESTER_NOTES.TOAST.FILE_READ_ERROR')))
    })
  }
  return (
    <Upload
      beforeUpload={async (file) => {
        await handleUploadFile(file, note.id)
        return false
      }}
      showUploadList={false}
    >
      <Button type='dashed' size='small' icon={<UploadOutlined />}>
        {t('COMMON.UPLOAD')}
      </Button>
    </Upload>
  )
}

export default UploadPsychologyNote
