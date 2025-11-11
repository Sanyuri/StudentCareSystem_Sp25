import { PageContext } from 'vike/types'
import { useTranslation } from 'react-i18next'
import { FC, Fragment, ReactNode, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import GlassIcon from '#components/common/icon/GlassIcon.js'
import InputDebounce from '#components/common/input/InputDebounce.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import AttendanceRate from '#components/features/Attendance/AttendanceRate.js'
import { EmailTemplate } from '#src/types/RequestModel/EmailTemplateRequest.js'
import SubEmailComponent from '#components/features/SubEmail/SubEmailComponent.js'
import AddEmailTemplate from '#components/features/EmailTemplate/AddEmailTemplate.js'
import EditEmailTemplate from '#components/features/EmailTemplate/EditEmailTemplate.js'
import TableEmailTemplate from '#components/features/EmailTemplate/TableEmailTemplate.js'
import { getPermissionTypeName, PermissionType } from '#src/types/Enums/PermissionType.js'
import DetailEmailTemplate from '#components/features/EmailTemplate/DetailEmailTemplate.js'
import DeleteEmailTemplate from '#components/features/EmailTemplate/DeleteEmailTemplate.js'
import { useDetailEmailTemplateData } from '#hooks/api/emailTemplate/useEmailTemplateData.js'

export const Page: FC = (): ReactNode => {
  const { t } = useTranslation()
  const pageContext: PageContext = usePageContext()
  const [searchTermDelayed, setSearchTermDelayed] = useState('')

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'detail' | 'edit' | 'delete' | null>(null) // Biến để theo dõi loại modal
  const [emailTemplateRequest, setEmailTemplateRequest] = useState<EmailTemplate>({ id: '' })
  const {
    data: selectedEmailTemplate,
    isLoading,
    refetch,
  } = useDetailEmailTemplateData(emailTemplateRequest)

  const { hasPermission } = useCheckPermission()
  const hasEditPermission = hasPermission(PermissionType.WriteEmailSample)

  const showModal = (Id: string, type: 'detail' | 'edit' | 'delete') => {
    setIsModalVisible(true)
    setModalType(type)
    setEmailTemplateRequest({ id: Id }) // Set the userId which triggers the query
  }

  const handleCloseModal = () => {
    setEmailTemplateRequest({ id: '' })
    setModalType(null)
    setIsModalVisible(false)
    //clear selected email template
  }

  const handleRefetch = async (): Promise<void> => {
    await refetch()
  }

  return (
    <Fragment>
      <section className='flex flex-wrap gap-6 justify-between items-center w-full text-sm leading-6 max-md:max-w-full'>
        {/* Input for searching */}
        <div className='flex items-center min-w-[300px]'>
          <InputDebounce
            value={searchTermDelayed}
            onDebouncedChange={setSearchTermDelayed}
            placeholder={t('EMAILTEMPLATES.TEMPLATE_SEARCH_TERM')}
            style={{ width: 400 }}
            variant='filled'
            className='h-10'
            prefix={<GlassIcon />}
          />
        </div>

        {/* Other Components */}
        <div className='flex items-center gap-6'>
          <SubEmailComponent />
          {pageContext.user?.permission?.includes(
            getPermissionTypeName(PermissionType.ReadAbsenceRateBoundary),
          ) && <AttendanceRate />}

          {/* Conditionally render AddEmailTemplate if role is 'Manager' */}
          {hasEditPermission && (
            <div className='flex items-center gap-6'>
              <AddEmailTemplate />
            </div>
          )}
        </div>
      </section>

      <div className='mt-4'>
        <TableEmailTemplate searchTerm={searchTermDelayed} showModal={showModal} />
      </div>
      {modalType === 'detail' && (
        <DetailEmailTemplate
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          showModal={showModal}
          staffDetails={selectedEmailTemplate}
          loading={isLoading}
        />
      )}
      {modalType === 'edit' && hasEditPermission && (
        <EditEmailTemplate
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          staffDetails={selectedEmailTemplate}
          loading={isLoading}
          onRefetch={handleRefetch}
        />
      )}
      {modalType === 'delete' && hasEditPermission && (
        <DeleteEmailTemplate
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          staffDetails={selectedEmailTemplate}
          loading={isLoading}
        />
      )}
    </Fragment>
  )
}
