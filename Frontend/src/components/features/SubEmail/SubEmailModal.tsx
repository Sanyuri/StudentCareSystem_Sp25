import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useState } from 'react'
import GlassIcon from '#components/common/icon/GlassIcon.js'
import InputDebounce from '#components/common/input/InputDebounce.js'
import EditSubEmail from '#components/features/SubEmail/EditSubEmail.js'
import TableSubEmail from '#components/features/SubEmail/TableSubEmail.js'
import DetailSubEmail from '#components/features/SubEmail/DetailSubEmail.js'
import DeleteSubEmail from '#components/features/SubEmail/DeleteSubEmail.js'
import { SubEmailDetailRequest } from '#types/RequestModel/SubEmailRequest.js'
import { useDetailSubEmailTemplateData } from '#hooks/api/subEmail/useSubEmailData.js'
import AddSubEmailComponent from '#components/features/SubEmail/AddSubEmailComponent.js'

interface SubEmailModalProps {
  isOpen: boolean
  onClose: () => void
}

const SubEmailModal: FC<SubEmailModalProps> = ({
  isOpen,
  onClose,
}: SubEmailModalProps): ReactNode => {
  const { t } = useTranslation()
  const [searchTermDelayed, setSearchTermDelayed] = useState('')

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'detail' | 'edit' | 'delete' | null>(null)
  const [subEmailRequest, setSubEmailRequest] = useState<SubEmailDetailRequest | null>(null)
  const { data: selectedSubEmail, isLoading } = useDetailSubEmailTemplateData(
    subEmailRequest || { id: '' },
  )

  const showModal = (id: string, type: 'detail' | 'edit' | 'delete'): void => {
    setIsModalVisible(true)
    setModalType(type)
    setSubEmailRequest({ id: id })
  }

  const handleCloseModal = (): void => {
    setIsModalVisible(false)
    setSubEmailRequest(null)
    setModalType(null)
  }

  return (
    <Modal
      title={t('SUB_EMAIL.MODAL.TITLE')}
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <main className='flex overflow-hidden flex-col p-6 rounded-2xl max-md:px-5'>
        <section className='flex flex-wrap gap-10 justify-between items-start mt-6 w-full text-sm leading-6 max-md:max-w-full'>
          <div className='min-w-[400px] max-md:max-w-full'>
            <InputDebounce
              value={searchTermDelayed}
              onDebouncedChange={setSearchTermDelayed}
              placeholder={t('SUB_EMAIL.PLACEHOLDER')}
              style={{ width: 500 }}
              variant='filled'
              className='h-10'
              prefix={<GlassIcon />}
            />
          </div>
          <AddSubEmailComponent />
        </section>
        <div className='mt-4'>
          <TableSubEmail searchTerm={searchTermDelayed} showModal={showModal} />
        </div>
        {modalType === 'detail' && (
          <DetailSubEmail
            isVisible={isModalVisible}
            onClose={handleCloseModal}
            showModal={showModal}
            subEmail={selectedSubEmail}
            loading={isLoading}
          />
        )}
        {modalType === 'edit' && (
          <EditSubEmail
            isVisible={isModalVisible}
            onClose={handleCloseModal}
            subEmail={selectedSubEmail}
            loading={isLoading}
          />
        )}
        {modalType === 'delete' && (
          <DeleteSubEmail
            isVisible={isModalVisible}
            onClose={handleCloseModal}
            subEmail={selectedSubEmail}
            loading={isLoading}
          />
        )}
      </main>
    </Modal>
  )
}

export default SubEmailModal
