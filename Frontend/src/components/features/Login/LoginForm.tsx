import _ from 'lodash'
import { FC, ReactNode, useRef } from 'react'
import '#assets/css/Login/login.scss'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import useAuthStore from '#stores/authState.js'
import handImage from '#assets/img/handImage.svg'
import { ConfigProvider, Form, Select } from 'antd'
import { TenantModel } from '#src/types/Data/TenantModel.js'
import { useLoginMutation } from '#hooks/api/auth/useAuth.js'
import { useTenantData } from '#hooks/api/tenant/useTenantData.js'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { navigate } from 'vike/client/router'
import useLoadingStore from '#stores/loadingState.js'
import { GoogleReCaptchaCheckbox } from '@google-recaptcha/react'
import useTemplateStore from '#stores/templateState.js'

const LoginForm: FC = (): ReactNode => {
  const { campusCode, setCampusCode } = useAuthStore()
  const { darkMode } = useTemplateStore()
  const reCaptchaTokenRef = useRef<string | undefined>()
  const { setLoading } = useLoadingStore()
  const { data } = useTenantData()
  const [form] = Form.useForm()
  const { t } = useTranslation()
  // Use the custom hook
  const { mutate } = useLoginMutation()

  const handleLogin = async (credentialResponse: CredentialResponse): Promise<void> => {
    if (!reCaptchaTokenRef) {
      toast.error(t('TOAST.ERROR.LOGIN.RECAPTCHA'))
      return
    }
    const loginRequest = {
      code: credentialResponse.credential,
      campusCode,
      reCaptcha: reCaptchaTokenRef.current,
    }
    mutate(loginRequest, {
      onSuccess: async () => {
        setLoading(true)
        const navigationPromise: Promise<void> = navigate('/')
        await navigationPromise
        setLoading(false)
        form.resetFields()
      },
    })
  }

  const handleCampusCodeChange = (value: string): void => {
    setCampusCode(value, _.find(data, { identifier: value })?.name ?? '')
  }

  const handleLoginClick = async (): Promise<void> => {
    await form.validateFields()
  }

  const errorMessage = false

  const options = data?.map((item: TenantModel): { value: string; label: ReactNode } => ({
    value: item.identifier,
    label: <span>{item.name.toUpperCase()}</span>,
  }))

  const handleRecaptchaChange = (value: string): void => {
    reCaptchaTokenRef.current = value
    // form.setFieldValue('recaptcha', value)
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            controlOutline: 'none',
          },
        },
      }}
    >
      <div className='flex flex-col justify-center max-w-full'>
        <div className='flex flex-col justify-center w-full max-md:max-w-full'>
          <img
            loading='lazy'
            src={handImage}
            alt='FPT Logo'
            className='object-contain w-10 aspect-square'
          />
          <h1 className='mt-3 text-4xl font-semibold tracking-tighter leading-tight max-md:max-w-full'>
            {t('LOGIN.LOGIN')}
          </h1>
          <p className='mt-3 text-base font-medium leading-relaxed max-md:max-w-full'>
            {t('LOGIN.WELCOME')}
          </p>
        </div>

        <Form
          form={form}
          layout='vertical'
          className='flex flex-col justify-center mt-10 w-full font-semibold max-md:max-w-full'
        >
          <Form.Item
            name='campusCode'
            label={
              <label
                htmlFor='input-field'
                className='flex gap-1 items-center self-start tracking-normal'
              >
                <span className='self-stretch my-auto'>{t('LOGIN.CAMPUS')}</span>
              </label>
            }
            rules={[{ required: true, message: t('LOGIN.RULES.CAMPUS') }]}
            className='flex flex-col w-full text-sm leading-6 max-md:max-w-full'
          >
            <Select
              placeholder={t('LOGIN.PLACEHOLDER')}
              listItemHeight={200}
              style={{ marginRight: '16px', width: '300px', backgroundColor: 'white' }}
              aria-invalid={errorMessage}
              dropdownStyle={{ margin: '16px' }}
              onChange={handleCampusCodeChange}
              aria-describedby={errorMessage ? 'error-message' : undefined}
              size='large'
              options={options}
            />
          </Form.Item>
          <Form.Item>
            <GoogleLogin
              theme='outline'
              width={300}
              shape='pill'
              logo_alignment='center'
              size='large'
              onSuccess={async (credentialResponse) => {
                await handleLoginClick()
                await handleLogin(credentialResponse)
              }}
              onError={() => {
                toast.error(t('TOAST.ERROR.LOGIN.INVALID_ACCOUNT'))
              }}
            />
          </Form.Item>
          <Form.Item
            name='recaptcha'
            rules={[
              {
                required: true,
                validator: () => {
                  if (!reCaptchaTokenRef.current) {
                    return Promise.reject(new Error(t('LOGIN.RULES.RECAPTCHA')))
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            {/* Replace the nested Form.Items with a cleaner structure */}
            <div className='mb-4'>
              <GoogleReCaptchaCheckbox
                theme={darkMode ? 'dark' : 'light'}
                onChange={(token: string) => {
                  handleRecaptchaChange(token)
                  form.setFieldValue('recaptcha', token)
                }}
              />
            </div>

            {/* Hidden form item for validation */}
            <Form.Item
              name='recaptcha'
              rules={[
                {
                  required: true,
                  validator: () => {
                    if (!reCaptchaTokenRef.current) {
                      return Promise.reject(new Error(t('LOGIN.RULES.RECAPTCHA')))
                    }
                    return Promise.resolve()
                  },
                },
              ]}
              style={{ display: 'none' }}
            >
              <input type='hidden' />
            </Form.Item>
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  )
}

export default LoginForm
