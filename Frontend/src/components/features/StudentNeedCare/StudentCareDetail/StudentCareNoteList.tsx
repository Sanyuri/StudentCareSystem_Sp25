import { FC, Fragment, ReactNode, useState } from 'react'
import { Button, Spin } from 'antd'
import NoteModal from '#components/common/note/NoteModal.js'
import { useNoteTypeDefaultData } from '#hooks/api/noteType/useNoteTypeData.js'
import { DefaultNoteType } from '#utils/constants/Note/index.js'
import { PageContext } from 'vike/types'
import { usePageContext } from 'vike-react/usePageContext'
import { useStudentNeedCareDetailData } from '#hooks/api/studentNeedCare/useStudentNeedCareData.js'
import NoteIcon from '#assets/icon/Document.svg?react'
import { useTranslation } from 'react-i18next'

const StudentCareNoteList: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [isViewAllNoteVisible, setIsViewAllNoteVisible] = useState(false)

  const pageContext: PageContext = usePageContext()
  const id: string = pageContext.routeParams['id'] ?? ''

  const { data: studentCareInfo } = useStudentNeedCareDetailData(id)
  const { data: careNoteType } = useNoteTypeDefaultData(DefaultNoteType.Care)

  if (!studentCareInfo || !careNoteType) return <Spin />
  return (
    <Fragment>
      <Button type={'primary'} onClick={() => setIsViewAllNoteVisible(true)} icon={<NoteIcon />}>
        {t('ATTENDANCES.FILTER.NOTE')}
      </Button>
      {/* Modal display all note */}
      <NoteModal
        noteType={careNoteType}
        studentRecord={studentCareInfo?.student}
        entityId={id}
        visible={isViewAllNoteVisible}
        onClose={() => setIsViewAllNoteVisible(false)}
      />
    </Fragment>
  )
}

export default StudentCareNoteList
