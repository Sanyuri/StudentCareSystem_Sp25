import { FC, ReactNode, useEffect, useState } from 'react'
import { Spin, Button } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import SemesterNotesList from '#components/features/PsychologyNoteList/NoteListItem.js'
import {
  usePsychologyNoteData,
  useStudentPsychologyData,
} from '#hooks/api/psychologyNotes/usePsychologyNoteData.js'
import { usePageContext } from 'vike-react/usePageContext'
import { AxiosError } from 'axios'
import VerifyStudentPsychology from '#components/features/StudentPsychology/VerifyStudentPsychology.js'
import { PageContext } from 'vike/types'
import AddPsychologyNoteModal from '#components/features/PsychologyNoteList/AddPsychologyNoteModal.js'
import InvalidStudentPsychologyMessage from '#src/utils/constants/ExceptionMessage/StudentPsychologyMessage.js'
import StudentInfoModal from '#components/features/PsychologyNoteList/StudentInfoModal.js'
import { usePsychologyNoteTypeData } from '#hooks/api/psychologyNoteType/usePsychologyNoteTypeData.js'
import { useTranslation } from 'react-i18next'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'

interface ErrorResponse {
  Message: string
}

export const Page: FC = (): ReactNode => {
  const { t } = useTranslation()
  const pageContext: PageContext = usePageContext()
  const id = pageContext.routeParams['id'] ?? ''

  const { data: notes, isLoading, refetch, error } = usePsychologyNoteData(id)
  const { data: studentInfo } = useStudentPsychologyData(id)
  const [isStudentInfoModalVisible, setIsStudentInfoModalVisible] = useState(false)
  const { data: psychologyNoteType } = usePsychologyNoteTypeData('')

  const { hasPermission } = useCheckPermission()

  const hasEditPermission = hasPermission(PermissionType.WritePsychologicalNote)

  useEffect(() => {
    void refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const result: number | undefined = (error as AxiosError)?.response?.status
  const resultMessage: string = (error as AxiosError<ErrorResponse>)?.response?.data?.Message ?? ''

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-end gap-4 mt-2'>
        {hasEditPermission && <AddPsychologyNoteModal studentPsychologyId={id} />}
        <div>
          <Button
            type='primary'
            icon={<InfoCircleOutlined />}
            onClick={() => setIsStudentInfoModalVisible(true)}
          >
            {t('PSYCHOLOGY_NOTE.BUTTON.STUDENT_INFO')}
          </Button>
        </div>
      </div>
      {result === 403 && resultMessage === InvalidStudentPsychologyMessage && (
        <VerifyStudentPsychology id={id} setIsModalVisible={() => {}} refetch={refetch} />
      )}

      <SemesterNotesList
        notes={notes || []}
        noteTypes={psychologyNoteType || []}
        refetchNotes={refetch}
        id={id}
        studentInfo={studentInfo?.student}
      />
      <StudentInfoModal
        visible={isStudentInfoModalVisible}
        onClose={() => setIsStudentInfoModalVisible(false)}
        studentInfo={studentInfo?.student}
      />
    </div>
  )
}
