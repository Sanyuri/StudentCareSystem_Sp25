import type React from 'react'
import { ReactNode, useState } from 'react'
import { Modal, Button, Space, Flex } from 'antd'
import { LeftOutlined, CheckOutlined } from '@ant-design/icons'
import {
  useConfirmStudentNeedCareMutation,
  useScanStudentNeedCareMutation,
} from '#hooks/api/studentNeedCare/useStudentNeedCareMutation.js'
import FirstStepScanStudentNeedCare from '#components/features/StudentNeedCare/ScanStudentNeedCare/FirstStepScanStudentNeedCare.js'
import ScanStudentNeedCareDisplay from '#components/features/StudentNeedCare/ScanStudentNeedCare/ScanStudentNeedCareDisplay.js'
import { useTranslation } from 'react-i18next'

interface ScanStudentsModalProps {
  open: boolean
  onClose: () => void
}

const ScanStudentsModal: React.FC<ScanStudentsModalProps> = ({
  open,
  onClose,
}: ScanStudentsModalProps): ReactNode => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [studentCount, setStudentCount] = useState<string>('')

  const { mutate: scanStudentNeedCare } = useScanStudentNeedCareMutation()
  const { mutate: confirmScanStudent } = useConfirmStudentNeedCareMutation()

  const handleNext = async () => {
    switch (currentStep) {
      case 0:
        scanStudentNeedCare(parseInt(studentCount), {
          onSuccess: () => {
            setCurrentStep(currentStep + 1)
          },
        })
        break
      case 1:
        confirmScanStudent(undefined, {
          onSuccess: () => {
            setStudentCount('')
            setCurrentStep(0)
            onClose()
          },
        })
        break
      default:
        break
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return t('STUDENT_NEED_CARE.SCAN.STEP.ONE')
      case 1:
        return t('STUDENT_NEED_CARE.SCAN.STEP.TWO')
      default:
        return t('STUDENT_NEED_CARE.SCAN.STEP.FOUR')
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <FirstStepScanStudentNeedCare
            studentCount={studentCount}
            setStudentCount={setStudentCount}
          />
        )
      case 1:
        return <ScanStudentNeedCareDisplay step={2} />
      default:
        return null
    }
  }

  const renderFooterButtons = () => {
    if (currentStep === 0) {
      return (
        <Flex justify='end'>
          <Space>
            <Button onClick={onClose}>{t('COMMON.CANCEL')}</Button>
            <Button type='primary' onClick={handleNext} disabled={!studentCount}>
              {t('COMMON.CONTINUE')}
            </Button>
          </Space>
        </Flex>
      )
    } else {
      return (
        <Flex justify='space-between'>
          <Button icon={<LeftOutlined />} onClick={handlePrevious}>
            {t('COMMON.BACK')}
          </Button>
          <Space>
            <Button onClick={onClose}>{t('COMMON.CANCEL')}</Button>
            <Button type='primary' onClick={handleNext}>
              {t('COMMON.CONTINUE')}
            </Button>
          </Space>
        </Flex>
      )
    }
  }

  return (
    <Modal
      title={getStepTitle()}
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      centered={true}
      styles={{ body: { maxHeight: '85vh', overflowY: 'auto' } }}
    >
      <div className='flex flex-col h-full'>
        {/* Step Navigation */}
        <div className='px-6 mb-8'>
          <div className='flex items-center justify-between relative'>
            {/* Step 1 */}
            <div className='flex flex-col items-center z-10'>
              {currentStep > 0 ? (
                <div className='w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white mb-2 shadow-md transition-all duration-300'>
                  <CheckOutlined />
                </div>
              ) : (
                <div
                  className={`w-10 h-10 rounded-full ${currentStep === 0 ? 'bg-blue-500' : 'bg-gray-200'} flex items-center justify-center text-white mb-2 shadow-md transition-all duration-300`}
                >
                  1
                </div>
              )}
              <span
                className={`text-sm font-medium ${
                  currentStep === 0
                    ? 'text-blue-500'
                    : currentStep > 0
                      ? 'text-green-500'
                      : 'text-gray-400'
                } transition-colors duration-300`}
              >
                {t('STUDENT_NEED_CARE.SCAN.STEP.ONE')}
              </span>
            </div>

            {/* Connector Line */}
            <div
              className={`h-1 flex-1 mx-4 rounded-full ${
                currentStep > 0 ? 'bg-green-500' : 'bg-gray-200'
              } transition-colors duration-500`}
            ></div>

            {/* Step 2 */}
            <div className='flex flex-col items-center z-10'>
              {currentStep > 1 ? (
                <div className='w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white mb-2 shadow-md transition-all duration-300'>
                  <CheckOutlined />
                </div>
              ) : (
                <div
                  className={`w-10 h-10 rounded-full ${currentStep === 1 ? 'bg-blue-500' : 'bg-gray-200'} flex items-center justify-center text-white mb-2 shadow-md transition-all duration-300`}
                >
                  2
                </div>
              )}
              <span
                className={`text-sm font-medium ${
                  currentStep === 1
                    ? 'text-blue-500'
                    : currentStep > 1
                      ? 'text-green-500'
                      : 'text-gray-400'
                } transition-colors duration-300`}
              >
                {t('STUDENT_NEED_CARE.SCAN.STEP.TWO')}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className='flex-1 overflow-y-auto px-6 py-4 bg-gray-50 rounded-lg mb-6'>
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className='pt-4 border-t border-gray-200'>{renderFooterButtons()}</div>
      </div>
    </Modal>
  )
}

export default ScanStudentsModal
