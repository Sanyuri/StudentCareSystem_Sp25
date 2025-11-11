import { useSubEmailTemplateData } from '#hooks/api/subEmail/useSubEmailData.js'
import { ClusterParameterButton } from '#utils/constants/EmailTemplate/variableButton.js'
import { Button, Popover } from 'antd'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface ClusterParameterButtonProps {
  emailType: string
  insertClusterVariable: (variable: string) => void
}

const ClusterParameterComponent: FC<ClusterParameterButtonProps> = ({
  emailType,
  insertClusterVariable,
}: Readonly<ClusterParameterButtonProps>): ReactNode => {
  const { t } = useTranslation()
  const { data } = useSubEmailTemplateData('', emailType, 1, 100)

  const popoverContent = (
    <div className='flex flex-col'>
      <ClusterParameterButton
        variables={data?.items || []}
        insertClusterVariable={insertClusterVariable}
      />
    </div>
  )

  return (
    <Popover placement='bottom' content={popoverContent} trigger='click'>
      <Button>+ {t('EMAILTEMPLATES.CLUSTER_PARAMETER_BUTTON')}</Button>
    </Popover>
  )
}

export default ClusterParameterComponent
