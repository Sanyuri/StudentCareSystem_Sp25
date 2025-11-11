import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { ControlOutlined } from '@ant-design/icons'
import { FC, Fragment, ReactNode, useState } from 'react'
import ProgressCriterionTypeModal from '#components/features/ProgressCriterionType/ProgressCriterionTypeModal.js'
import SanitizedHTML from '#components/common/SanitizedHTML.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'

const ProgressCriterionTypeButton: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { hasPermission } = useCheckPermission()

  const hasReadPermission = hasPermission(PermissionType.ReadProgressCriterionType)

  return (
    <Fragment>
      {hasReadPermission && (
        <Button
          onClick={(): void => setIsModalOpen(true)}
          type='primary'
          size='large'
          icon={<ControlOutlined />}
        >
          <SanitizedHTML htmlContent={t('PROGRESS_CRITERION.MODAL.BUTTON')} />
        </Button>
      )}
      <ProgressCriterionTypeModal
        isOpen={isModalOpen}
        onClose={(): void => setIsModalOpen(false)}
      />
    </Fragment>
  )
}

export default ProgressCriterionTypeButton
