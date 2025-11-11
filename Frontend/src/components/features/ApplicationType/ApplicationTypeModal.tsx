import { Form, Input, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce, DebouncedFunc } from 'lodash'
import glassIcon from '#assets/icon/glassIcon.svg'
import { ApplicationType } from '#src/types/RequestModel/ApplicationTypeRequest.js'
import AddApplicationType from '#components/features/ApplicationType/AddApplicationType.js'
import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useMemo, useState } from 'react'
import EditApplicationType from '#components/features/ApplicationType/EditApplicationType.js'
import TableApplicationType from '#components/features/ApplicationType/TableApplicationType.js'
import DetailApplicationType from '#components/features/ApplicationType/DetailApplicationType.js'
import DeleteApplicationType from '#components/features/ApplicationType/DeleteApplicationType.js'
import { useDetailApplicationTypeData } from '#hooks/api/applicationType/useApplicationTypeData.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'

interface ApplicationTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

const ApplicationTypeModal: FC<ApplicationTypeModalProps> = ({
  isOpen,
  onClose,
}: ApplicationTypeModalProps): ReactNode => {
  const { t } = useTranslation()

  const { hasPermission } = useCheckPermission()

  const hasEditPermission = hasPermission(PermissionType.WriteApplicationType)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermDelayed, setSearchTermDelayed] = useState(searchTerm)

  const debouncedSetSearchTermDelayed: DebouncedFunc<Dispatch<SetStateAction<string>>> = useMemo(
    (): DebouncedFunc<Dispatch<SetStateAction<string>>> => debounce(setSearchTermDelayed, 2000),
    [],
  )

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'detail' | 'edit' | 'delete' | null>(null)
  const [applicationTypeRequest, setApplicationTypeRequest] = useState<ApplicationType | null>(null)
  const { data: selectedApplicationType, isLoading } = useDetailApplicationTypeData(
    applicationTypeRequest || { id: '' },
  )

  const showModal = (Id: string, type: 'detail' | 'edit' | 'delete'): void => {
    setIsModalVisible(true)
    setModalType(type)
    setApplicationTypeRequest({ id: Id })
  }

  const handleCloseModal = (): void => {
    setIsModalVisible(false)
    setApplicationTypeRequest(null)
    setModalType(null)
  }

  useEffect(() => {
    debouncedSetSearchTermDelayed(searchTerm)

    return () => {
      debouncedSetSearchTermDelayed.cancel()
    }
  }, [searchTerm, debouncedSetSearchTermDelayed])

  const handleSubmit = (): void => {
    setSearchTermDelayed(searchTerm)
  }

  return (
    <Modal
      title={t('LAYOUT.APPLICATION_TYPE')}
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={null}
      centered
    >
      <main className='flex overflow-hidden flex-col p-6 rounded-2xl max-md:px-5'>
        {hasEditPermission && <AddApplicationType />}

        <section className='flex flex-wrap gap-10 justify-between items-start mt-6 w-full text-sm leading-6 max-md:max-w-full'>
          <Form onFinish={handleSubmit} className='min-w-[400px] max-md:max-w-full'>
            <Input
              variant='filled'
              style={{ width: 500 }}
              placeholder={t('APPLICATION_TYPE.TEMPLATE_SEARCH_TERM')}
              className=' h-10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={
                <img
                  loading='lazy'
                  src={glassIcon}
                  alt=''
                  className='object-contain shrink-0 self-stretch my-auto w-6 aspect-square'
                />
              }
            />
          </Form>
        </section>
        <div className='mt-4'>
          <TableApplicationType searchTerm={searchTermDelayed} showModal={showModal} />
        </div>
        {modalType === 'detail' && (
          <DetailApplicationType
            isVisible={isModalVisible}
            onClose={handleCloseModal}
            showModal={showModal}
            staffDetails={selectedApplicationType}
            loading={isLoading}
          />
        )}
        {modalType === 'edit' && hasEditPermission && (
          <EditApplicationType
            isVisible={isModalVisible}
            onClose={handleCloseModal}
            staffDetails={selectedApplicationType}
            loading={isLoading}
          />
        )}
        {modalType === 'delete' && hasEditPermission && (
          <DeleteApplicationType
            isVisible={isModalVisible}
            onClose={handleCloseModal}
            staffDetails={selectedApplicationType}
            loading={isLoading}
          />
        )}
      </main>
    </Modal>
  )
}

export default ApplicationTypeModal
