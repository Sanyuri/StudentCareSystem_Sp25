import TableSubject from '#components/features/Subject/TableSubject.js'
import { useTranslation } from 'react-i18next'
import { FC, Fragment, ReactNode, useState } from 'react'
import { Subject } from '#src/types/RequestModel/SubjectRequest.js'
import DetailSubject from '#components/features/Subject/DetailSubject.js'
import AddSubject from '#components/features/Subject/AddSubject.js'
import DeleteSubject from '#components/features/Subject/DeleteSubject.js'
import { useDetailSubjectData } from '#hooks/api/subject/useSubjectData.js'
import InputDebounce from '#components/common/input/InputDebounce.js'
import GlassIcon from '#components/common/icon/GlassIcon.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'

export const Page: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [searchTermDelayed, setSearchTermDelayed] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'detail' | 'edit' | 'delete' | null>(null)
  const [SubjectRequest, setSubjectRequest] = useState<Subject | null>(null)
  const { data: selectedSubject, isLoading } = useDetailSubjectData(SubjectRequest || { id: '' })

  const { hasPermission } = useCheckPermission()

  const hasEditPermission = hasPermission(PermissionType.WriteStudentSubject)
  const showModal = (Id: string, type: 'detail' | 'edit' | 'delete') => {
    setIsModalVisible(true)
    setModalType(type)
    setSubjectRequest({ id: Id })
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSubjectRequest(null)
    setModalType(null)
  }

  return (
    <Fragment>
      <section className='flex flex-wrap gap-10 justify-between items-start mt-6 w-full text-sm leading-6 max-md:max-w-full'>
        <div className='min-w-[400px] max-md:max-w-full'>
          <InputDebounce
            value={searchTermDelayed}
            onDebouncedChange={setSearchTermDelayed}
            placeholder={t('SUBJECT.TEMPLATE_SEARCH_TERM')}
            style={{ width: 500 }}
            variant='filled'
            className='h-10'
            prefix={<GlassIcon />}
          />
        </div>
        {hasEditPermission && <AddSubject />}
      </section>
      <div className='mt-4'>
        <TableSubject searchTerm={searchTermDelayed} showModal={showModal} />
      </div>
      {modalType === 'detail' && (
        <DetailSubject
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          showModal={showModal}
          staffDetails={selectedSubject}
          loading={isLoading}
        />
      )}
      {modalType === 'delete' && hasEditPermission && (
        <DeleteSubject
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          staffDetails={selectedSubject}
          loading={isLoading}
        />
      )}
    </Fragment>
  )
}
