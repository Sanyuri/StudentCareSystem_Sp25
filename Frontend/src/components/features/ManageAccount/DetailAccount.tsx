import moment from 'moment'
import { FC, ReactNode } from 'react'
import { Button, Modal, Spin } from 'antd'
import icon from '#utils/constants/icon.js'
import { useTranslation } from 'react-i18next'
import useTemplateStore from '#stores/templateState.js'
import { PermissionData } from '#types/Data/PermissionData.js'
import { GetUserDetailResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { usePermissionByRole } from '#hooks/api/permission/usePermission.js'

interface StaffModalProps {
  isVisible: boolean
  onClose: () => void
  showModal: (userId: string, type: 'detail' | 'edit') => void
  staffDetails: GetUserDetailResponse | undefined
  loading: boolean
}

const DetailAccount: FC<StaffModalProps> = ({
  isVisible,
  onClose,
  showModal,
  staffDetails,
  loading,
}: StaffModalProps): ReactNode => {
  const { t, i18n } = useTranslation()
  const { data: permissionsData } = usePermissionByRole(staffDetails?.role.id)

  const { darkMode } = useTemplateStore()
  const handleEditModal = (): void => {
    if (staffDetails?.id) {
      onClose()
      showModal(staffDetails.id, 'edit')
    }
  }
  const currentLanguage = i18n.language
  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      centered
      footer={null}
      styles={{
        body: {
          overflowX: 'hidden',
          maxHeight: '500px',
          overflowY: 'scroll', // Enable vertical scroll
        },
      }}
      width={600}
      title={<div className='text-lg font-bold'>{t(`ACCOUNTS.FORM.LABEL.DETAIL_ACCOUNT`)}</div>}
    >
      {loading && staffDetails ? (
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      ) : (
        <div className='p-4 space-y-4'>
          <div className='p-3 rounded-md flex items-center'>
            <img src={icon.calendarIcon} className={`${darkMode ? 'invert' : ''}`} />
            <p className='text-xs  mx-3 my-auto'>{t(`ACCOUNTS.FORM.LABEL.CREATED_TIME`)}</p>
            <p className='text-sm font-medium my-auto'>
              {moment(staffDetails?.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </p>
          </div>
          <div className='p-3 rounded-md flex items-center'>
            <img
              src={icon.calendarEditIcon}
              className={`${darkMode ? 'invert' : ''}`}
              alt={'calendar icon'}
            />
            <p className='text-xs  mx-3 my-auto'>{t(`ACCOUNTS.FORM.LABEL.UPDATED_TIME`)}</p>
            <p className='text-sm font-medium my-auto'>
              {moment(staffDetails?.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='p-3 rounded-md flex items-start'>
              <div>
                <p className='text-xs mb-1'>{t(`ACCOUNTS.FORM.LABEL.FULL_NAME`)}</p>
                <p className='text-sm font-medium'>{staffDetails?.fullName}</p>
              </div>
            </div>
            <div className='p-3 rounded-md flex items-start'>
              <div>
                <p className='text-xs mb-1'>{t(`ACCOUNTS.FORM.LABEL.EMAIL_ACCOUNT`)}</p>
                <p className='text-sm font-medium'>{staffDetails?.email}</p>
              </div>
            </div>

            {staffDetails?.feEmail && (
              <div className='p-3 rounded-md flex items-start'>
                <div>
                  <p className='text-xs mb-1'>{t(`ACCOUNTS.FORM.LABEL.FE_EMAIL_ACCOUNT`)}</p>
                  <p className='text-sm font-medium'>{staffDetails.feEmail}</p>
                </div>
              </div>
            )}
          </div>

          <div className='p-3 rounded-md'>
            <label
              htmlFor='permissionIds'
              className='flex items-center w-full mb-2'
              aria-label='Permissions'
            >
              <div className='flex items-center w-full'>
                <span className='text-xs  mb-1'>{t(`ACCOUNTS.FORM.LABEL.PERMISSIONS`)}</span>
                <span className=' font-bold flex-grow text-right mr-4'>
                  {staffDetails?.permissions?.length}/{permissionsData?.length}
                </span>
              </div>
            </label>
            <ul className='list-disc pl-5'>
              {staffDetails?.permissions?.map(
                (permission: PermissionData, index: number): ReactNode => (
                  <li key={index} className='text-sm font-medium'>
                    {currentLanguage === 'vi' ? permission.vietnameseName : permission.englishName}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className='p-3 rounded-md flex items-start'>
            <div>
              <p className='text-xs mb-1'>{t(`ACCOUNTS.FORM.LABEL.STATUS`)}</p>
              <span
                className={`inline-block px-2 py-1 text-xs font-medium ${
                  staffDetails?.status === 'Inactive'
                    ? 'text-red-700 bg-red-100 border-red-400'
                    : 'text-green-700 bg-green-100 border-green-400'
                } rounded-full`}
              >
                {staffDetails?.status === 'Inactive'
                  ? t(`ACCOUNTS.FORM.LABEL.INACTIVE`)
                  : t(`ACCOUNTS.FORM.LABEL.ACTIVE`)}
              </span>
            </div>
          </div>
          <div className='flex justify-end mt-6'>
            <Button color='primary' variant='outlined' onClick={handleEditModal}>
              <img src={icon.editBlueIcon} className='text-blue-400' alt={'edit icon'} />
              <span className='font-medium'>{t(`ACCOUNTS.LABEL.EDIT_ACCOUNT`)}</span>
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default DetailAccount
