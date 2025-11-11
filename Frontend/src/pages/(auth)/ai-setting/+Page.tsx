import _ from 'lodash'
import { FC } from 'react'
import { reload } from 'vike/client/router'
import { useTranslation } from 'react-i18next'
import { AppSetting } from '#src/types/Data/AppSetting.js'
import { useAISettingData } from '#hooks/api/aiSetting/useAISettingData.js'
import { Button, Card, Divider, Form, Input, Switch, Typography } from 'antd'
import { useAppSettingData } from '#hooks/api/appSetting/useAppSettingData.js'
import { AISettingRequest } from '#src/types/RequestModel/AISettingRequest.js'
import { convertToLocalDateTime } from '#utils/helper/convertToCurrentTime.js'
import { useAISettingMutation } from '#hooks/api/aiSetting/useAISettingMutation.js'
import { useAppSettingMutation } from '#hooks/api/appSetting/useAppSettingMutation.js'

const { Title, Text } = Typography

const AISettingPage: FC = () => {
  const { t } = useTranslation()
  const { data: settingData } = useAppSettingData()
  const { data: aiSettingData } = useAISettingData()

  const { mutate: updateSetting } = useAppSettingMutation()
  const { mutate: updateAISetting } = useAISettingMutation()

  const handelUpdateSetting = (key: string, value: string | undefined) => {
    const updateSettingModel: AppSetting | undefined = _.find(settingData, { key: key })
    if (updateSettingModel) {
      updateSettingModel.value = value
      const updateBodyUpdate = {
        id: updateSettingModel.id,
        appSettingRequest: updateSettingModel,
      }
      updateSetting(updateBodyUpdate, {
        onSuccess: () => {
          void reload()
        },
      })
    }
  }

  const handelUpdateAISetting = (values: { provider: string; modelId: string }) => {
    const updateSettingModel: AISettingRequest = {
      provider: values.provider,
      // eslint-disable-next-line camelcase
      model_id: values.modelId,
    }

    updateAISetting(updateSettingModel, {
      onSuccess: () => {
        void reload()
      },
    })
  }
  return (
    <div className='container mx-auto px-4 py-6'>
      <Card className='shadow-md'>
        <div className='space-y-6'>
          <div>
            <Title level={4}>{t('AI_SETTINGS.GENERAL_SETTINGS')}</Title>
            <Divider />

            <div className='flex items-center justify-between mb-4'>
              <div>
                <Text strong>{t('AI_SETTINGS.ENABLE_CHATBOT')}</Text>
                <div>
                  <Text type='secondary'>{t('AI_SETTINGS.ENABLE_CHATBOT_DESC')}</Text>
                </div>
              </div>
              <Switch
                checked={
                  settingData?.find((s: AppSetting) => s.key === 'ENABLE_CHATBOT')?.value === 'true'
                }
                onChange={(checked: boolean) =>
                  handelUpdateSetting('ENABLE_CHATBOT', checked.toString())
                }
              />
            </div>
          </div>

          <div>
            <Title level={4}>{t('AI_SETTINGS.MODEL_SETTINGS')}</Title>
            <Divider />

            {/* Display current model information */}
            <div className='mb-6 px-4 bg-gray-50 rounded-md'>
              <Text strong className='block mb-2'>
                {t('AI_SETTINGS.CURRENT_MODEL')}
              </Text>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <Text type='secondary'>Provider:</Text>
                  <div className='font-medium'>{aiSettingData?.provider ?? '-'}</div>
                </div>
                <div>
                  <Text type='secondary'>Model ID:</Text>
                  <div className='font-medium'>{aiSettingData?.model_id ?? '-'}</div>
                </div>
                <div>
                  <Text type='secondary'>{t('AI_SETTINGS.LAST_UPDATED')}</Text>
                  <div className='font-medium'>
                    {convertToLocalDateTime(aiSettingData?.UpdatedAt ?? '')}
                  </div>
                </div>
              </div>
            </div>

            {/* Input fields for new model settings */}
            <div className='mb-4 space-y-4'>
              <Form
                layout='vertical'
                onFinish={handelUpdateAISetting}
                initialValues={{
                  provider: aiSettingData?.provider ?? '',
                  modelId: aiSettingData?.model_id ?? '',
                }}
              >
                <Form.Item
                  name='provider'
                  label={t('AI_SETTINGS.PROVIDER')}
                  rules={[
                    { required: true, message: t('COMMON.FIELD_REQUIRED') },
                    { min: 2, message: t('COMMON.MIN_LENGTH_2', { length: 2 }) },
                  ]}
                >
                  <Input placeholder='e.g. google, openai, anthropic' className='w-full max-w-md' />
                </Form.Item>

                <Form.Item
                  name='modelId'
                  label={t('AI_SETTINGS.MODEL_ID')}
                  rules={[
                    { required: true, message: t('COMMON.FIELD_REQUIRED') },
                    { min: 3, message: t('COMMON.MIN_LENGTH_2', { length: 2 }) },
                  ]}
                >
                  <Input
                    placeholder='e.g. gemini-2.0-flash-001, gpt-4'
                    className='w-full max-w-md'
                  />
                </Form.Item>

                <Form.Item>
                  <Button type='primary' htmlType='submit' className='bg-blue-500'>
                    {t('COMMON.SAVE')}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AISettingPage
