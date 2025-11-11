import { Button, Image, Modal } from 'antd'
import { FC, Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EyeOutlined } from '@ant-design/icons'
import { PermissionData } from '#src/types/Data/PermissionData.js'
import { getPermissionImageUrl } from '#utils/constants/permissionImageLink.js'

interface PermissionImageProps {
  permission: PermissionData
}

const PermissionImage: FC<PermissionImageProps> = ({ permission }: PermissionImageProps) => {
  const { t } = useTranslation()
  const [isImageModalVisible, setIsImageModalVisible] = useState<boolean>(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  const handleImagePreview = (imageUrl: string | null) => {
    if (imageUrl) {
      setPreviewImageUrl(imageUrl)
      setIsImageModalVisible(true)
    }
  }
  return (
    <Fragment>
      <Button
        type='text'
        icon={<EyeOutlined />}
        size='small'
        className='ml-2 text-blue-500 hover:text-blue-700'
        onClick={() => handleImagePreview(getPermissionImageUrl(permission.permissionType) || null)}
      />
      <Modal
        title={t('PERMISSIONS.PERMISSION_PREVIEW')}
        open={isImageModalVisible}
        onCancel={() => setIsImageModalVisible(false)}
        footer={null}
        width={800}
        centered
      >
        {previewImageUrl && (
          <div className='flex justify-center'>
            <Image src={previewImageUrl} alt='preview' width={1000} height={500} preview={false} />
          </div>
        )}
      </Modal>
    </Fragment>
  )
}

export default PermissionImage
