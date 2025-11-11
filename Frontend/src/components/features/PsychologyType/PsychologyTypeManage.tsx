import { Button } from 'antd'
import { FC, ReactNode, useState } from 'react'
import { SmallDashOutlined } from '@ant-design/icons'
import PsychologyTypeModal from '#components/features/PsychologyType/PsychologyTypeModal.js'

const PsychologyTypeManage: FC = (): ReactNode => {
  // const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className='p-6'>
      <Button
        type='dashed'
        icon={<SmallDashOutlined />}
        onClick={(): void => setIsModalOpen(true)}
        style={{ width: '100%', marginBottom: 16 }}
      >
        Quản lí câu hỏi tư vấn
      </Button>
      <PsychologyTypeModal isOpen={isModalOpen} onClose={(): void => setIsModalOpen(false)} />
    </div>
  )
}

export default PsychologyTypeManage
