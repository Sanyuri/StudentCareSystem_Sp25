import _ from 'lodash'
import i18n from '#src/plugins/i18n.js'
import { useTranslation } from 'react-i18next'
import useAuthStore from '#stores/authState.js'
import { DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons'
import { RoleValue } from '#utils/constants/role.js'
import { AppSetting } from '#types/Data/AppSetting.js'
import useTemplateStore from '#stores/templateState.js'
import { encryptStorage } from '#utils/helper/storage.js'
import { FC, ReactElement, ReactNode, useEffect, useState } from 'react'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import ImagePreviewModal from '#components/common/modal/ImagePreviewModal.js'
import {
  useDeleteSettingMutation,
  useSettingMutation,
} from '#hooks/api/setting/useSettingMutation.js'
import { useAppSettingData } from '#hooks/api/appSetting/useAppSettingData.js'
import DarkModeSwitch from '#components/common/darkModeSwitch/DarkModeSwitch.js'
import { useAppSettingMutation } from '#hooks/api/appSetting/useAppSettingMutation.js'
import { Button, Card, Col, Collapse, Row, Select, Space, Switch, Typography, Upload } from 'antd'
import { reload } from 'vike/client/router'
import { useAttendanceScanMutation } from '#hooks/api/attendance/useAttendanceMutation.js'
import { useSemesterData } from '#hooks/api/semester/useSemesterData.js'
import { Semester } from '#types/Data/Semester.js'
import { toast } from 'react-toastify'
import { useCurrentUserData } from '#hooks/api/auth/useUserData.js'
import { useDisable2FaMutation, useEnable2FaMutation } from '#hooks/api/2fa/use2FaMutation.js'
import { unknown } from 'zod'
import { TwoFactorAuthenticationResponse } from '#src/types/ResponseModel/2FaResponse.js'
import OtpModal from '#components/features/Otp/OtpModal.js'
import SignAsComponent from '#components/features/Setting/SignAsComponent.js'
import TrainingAiButton from '#components/features/Setting/TrainingAiButton.js'
import ScanDeferSetting from '#components/features/Setting/ScanDeferSetting.js'

const { Option } = Select
const { Title } = Typography

const Page: FC = (): ReactNode => {
  const { t } = useTranslation()
  const [selectedLanguage, setSelectedLanguage] = useState('vi') // Fallback default value
  const [semesterName, setSemesterName] = useState<string | undefined>()
  const { fontStyle, setFontStyle } = useTemplateStore()
  // State cho ảnh nền và xem trước
  const [headerImage, setHeaderImage] = useState<undefined | string>(undefined) // Ảnh header hiện tại
  const [contentImage, setContentImage] = useState<undefined | string>(undefined)
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null)
  const [previewType, setPreviewType] = useState<'content' | 'header' | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null) // Lưu file ảnh
  const [twoFaAuth, setTwoFaAuth] = useState<undefined | TwoFactorAuthenticationResponse>(undefined)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { role } = useAuthStore()

  const { data: settingData } = useAppSettingData()
  const { data: semesters } = useSemesterData()
  const { mutate: updateSetting } = useAppSettingMutation()
  const { mutate: updateBackground } = useSettingMutation()
  const { mutate: removeBackground } = useDeleteSettingMutation()
  const { mutate: triggerScanAttendance } = useAttendanceScanMutation()
  const { data: currentUser } = useCurrentUserData()
  const { mutate: disable2Fa } = useDisable2FaMutation()
  const { mutate: enable2Fa } = useEnable2FaMutation()

  const fontOptions = [
    { label: 'Roboto', value: 'Roboto, sans-serif' },
    { label: 'Open Sans', value: 'Open Sans, sans-serif' },
    { label: 'Lobster', value: 'Lobster, cursive' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' },
    { label: 'Courier New', value: 'Courier New, monospace' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
    { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Pacifico', value: 'Pacifico, cursive' },
    { label: 'Montserrat', value: 'Montserrat, sans-serif' },
    { label: 'Playfair Display', value: 'Playfair Display, serif' },
    { label: 'Raleway', value: 'Raleway, sans-serif' },
    { label: 'Merriweather', value: 'Merriweather, serif' },
  ]
  const handleFontChange = (value: string) => {
    setFontStyle(value)
  }
  const handleChangeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang)
    encryptStorage.setItem('defaultLocale', lang)
    setSelectedLanguage(lang)
  }

  useEffect(() => {
    const storedLanguage: string | undefined = encryptStorage.getItem('defaultLocale')
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage)
    }
  }, [])

  // Xử lý upload file
  const handleUpload = (info: UploadChangeParam<UploadFile>, type: 'content' | 'header') => {
    const file = info.file as unknown as File
    if (file) {
      setBackgroundImage(file) // Lưu file ảnh vào state
      const reader = new FileReader()

      // Đọc file để lấy dữ liệu base64 xem trước
      reader.onload = () => {
        setPreviewImage(reader.result) // Lưu base64 cho xem trước
        setPreviewType(type) // Lưu loại ảnh
        setIsModalVisible(true) // Hiển thị modal
      }

      reader.readAsDataURL(file)
    }
  }

  // Xử lý khi nhấn Submit trong modal
  const handleModalSubmit = () => {
    if (!previewType || !backgroundImage) {
      setIsModalVisible(false)
      return
    }

    // Chuẩn bị FormData để gửi
    const formData = new FormData()
    formData.append('backgroundType', previewType) // Gửi loại ảnh
    formData.append('backgroundImage', backgroundImage) // Gửi file ảnh

    // Update image in frontend server static
    updateBackground(formData, {
      onSuccess: () => {
        setIsModalVisible(false)
        setPreviewImage(null) // Xóa ảnh xem trước
        setBackgroundImage(null) // Xóa ảnh từ state
      },
    })

    // Update image in be
    const updateBackGroundType: string =
      previewType === 'header' ? 'HEADER_BACKGROUND' : 'BODY_BACKGROUND'
    const imageUrl: string =
      previewType === 'header' ? '/uploads/header.jpg' : '/uploads/content.jpg'
    handelUpdateSetting(updateBackGroundType, imageUrl)
  }
  const handleModalCancel = () => {
    setIsModalVisible(false)
    setPreviewImage(null)
  }

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

  const handelDisable2Fa = () => {
    disable2Fa()
  }

  const handleEnable2Fa = () => {
    enable2Fa(unknown, {
      onSuccess: (data: TwoFactorAuthenticationResponse) => {
        setTwoFaAuth(data)
        setIsModalVisible(true)
      },
    })
  }

  useEffect(() => {
    const headerImageUrl: string | undefined = _.find(settingData, {
      key: 'HEADER_BACKGROUND',
    })?.value
    const contentImageUrl: string | undefined = _.find(settingData, {
      key: 'BODY_BACKGROUND',
    })?.value
    if (headerImageUrl) {
      setHeaderImage(headerImageUrl)
    }
    if (contentImageUrl) {
      setContentImage(contentImageUrl)
    }
  }, [settingData])
  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl)
    setIsModalVisible(true)
  }

  const handleRemoveImage = (type: string) => {
    if (type === 'header') {
      removeBackground({ type: 'header' })
      handelUpdateSetting('HEADER_BACKGROUND', undefined)
    } else {
      removeBackground({ type: 'content' })
      handelUpdateSetting('BODY_BACKGROUND', undefined)
    }
  }
  const handleChange = (value: string) => {
    setSemesterName(value)
  }

  const handleTrigger = () => {
    if (!semesterName) {
      toast.error(t('COMMON.NEED_SEMESTER'))
    } else {
      triggerScanAttendance(semesterName)
    }
  }
  const collapseItems = [
    {
      key: 'personal',
      label: (
        <Title level={5} className='m-0'>
          {t('SETTINGS.PERSONAL_SETTINGS')}
        </Title>
      ),
      children: (
        <>
          <Row gutter={[16, 16]} align='middle'>
            <Col span={12}>
              <Title level={5} className='mb-2'>
                {t('SETTINGS.LANGUAGE')}
              </Title>
              <Select
                value={selectedLanguage}
                className='w-full'
                onChange={handleChangeLanguage}
                popupClassName='rounded-lg'
              >
                <Option value='vi'>{t('COMMON.VIETNAMESE')}</Option>
                <Option value='en'>{t('COMMON.ENGLISH')}</Option>
                <Option value='jp'>{t('COMMON.JAPANESE')}</Option>
              </Select>
            </Col>
            <Col span={12}>
              <Title level={5} className='mb-2'>
                {t('SETTINGS.FONT_STYLE')}
              </Title>
              <Select
                className='w-full'
                value={fontStyle}
                onChange={handleFontChange}
                popupClassName='rounded-lg'
              >
                {fontOptions.map((font) => (
                  <Option key={font.value} value={font.value}>
                    {font.label}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row className='mt-4'>
            <Col span={24}>
              <Space size='large'>
                <div>
                  <Title level={5} className='mb-2'>
                    {t('SETTINGS.THEME')}
                  </Title>
                  <DarkModeSwitch />
                </div>
              </Space>
            </Col>
          </Row>
        </>
      ),
      className: 'rounded-lg',
    },
    {
      key: 'totp',
      label: (
        <Title level={5} className='m-0'>
          {t('SETTINGS.TOTP_SETTINGS')}
        </Title>
      ),
      children: (
        <>
          {!currentUser?.isEnable2Fa ? (
            <>
              <Row className='mt-4'>
                <Col span={12}>
                  <Title level={5} className='mb-2'>
                    {t('SETTINGS.TOTP_ENABLE')}
                  </Title>
                </Col>
                <Col span={12} className='flex justify-end'>
                  <Button type='primary' onClick={() => handleEnable2Fa()}>
                    {t('SETTINGS.TOTP_ENABLE')}
                  </Button>
                </Col>
              </Row>
              <Row>{t('SETTINGS.TOTP_ENABLE_DESCRIPTION')}</Row>
            </>
          ) : (
            <>
              <OtpModal
                twoFaAuth={twoFaAuth}
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
              ></OtpModal>
              <Row className='mt-4'>
                <Col span={12}>
                  <Title level={5} className='mb-2'>
                    {t('SETTINGS.TOTP_DISABLE')}
                  </Title>
                </Col>
                <Col span={12} className='flex justify-end'>
                  <Button type='primary' danger onClick={() => handelDisable2Fa()}>
                    {t('SETTINGS.TOTP_DISABLE')}
                  </Button>
                </Col>
              </Row>
              <Row>{t('SETTINGS.TOTP_DISABLE_DESCRIPTION')}</Row>
            </>
          )}
        </>
      ),
    },
    ...(role === RoleValue.ADMIN
      ? [
          {
            key: 'website',
            label: (
              <Title level={5} className='m-0'>
                {t('SETTINGS.WEBSITE_SETTINGS')}
              </Title>
            ),
            children: (
              <>
                <Row gutter={[16, 16]}>
                  {/* Header Image Upload */}
                  <Col span={12}>
                    <Title level={5} className='mb-2'>
                      {t('SETTINGS.UPLOAD_HEADER_BACKGROUND')}
                    </Title>
                    <Upload
                      accept='image/*'
                      showUploadList={false}
                      beforeUpload={() => false}
                      onChange={(info) => handleUpload(info, 'header')}
                    >
                      {headerImage ? (
                        <div className='relative w-full cursor-pointer hover:opacity-20'>
                          <img
                            src={headerImage}
                            alt='header preview'
                            className='w-full h-[100px] object-cover rounded'
                          />
                          <div className='absolute bottom-1 right-1 flex gap-1'>
                            <Button
                              icon={<EyeOutlined />}
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePreview(headerImage)
                              }}
                              size='small'
                            />
                            <Button
                              icon={<DeleteOutlined />}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveImage('header')
                              }}
                              size='small'
                              danger
                            />
                          </div>
                        </div>
                      ) : (
                        <UploadButton />
                      )}
                    </Upload>
                  </Col>

                  {/* Content Image Upload */}
                  <Col span={12}>
                    <Title level={5} className='mb-2'>
                      {t('SETTINGS.UPLOAD_CONTENT_BACKGROUND')}
                    </Title>
                    <Upload
                      accept='image/*'
                      showUploadList={false}
                      beforeUpload={() => false}
                      onChange={(info) => handleUpload(info, 'content')}
                    >
                      {contentImage ? (
                        <div className='relative w-full'>
                          <img
                            src={contentImage}
                            alt='content preview'
                            className='w-full h-[100px] object-cover rounded cursor-pointer hover:opacity-20'
                          />
                          <div className='absolute bottom-1 right-1 flex gap-1'>
                            <Button
                              icon={<EyeOutlined />}
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePreview(contentImage)
                              }}
                              size='small'
                            />
                            <Button
                              icon={<DeleteOutlined />}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveImage('content')
                              }}
                              size='small'
                              danger
                            />
                          </div>
                        </div>
                      ) : (
                        <UploadButton />
                      )}
                    </Upload>
                  </Col>
                </Row>
                <Row className='mt-6' gutter={[16, 16]}>
                  <Col span={12}>
                    <Space size='large'>
                      <div>
                        <Title level={5} className='mb-2'>
                          {t('SETTINGS.DISABLE_DEVTOOL')}
                        </Title>
                        <Switch
                          checked={
                            settingData?.find((s: AppSetting) => s.key === 'DISABLE_DEVTOOL')
                              ?.value === 'true'
                          }
                          onChange={(checked: boolean) =>
                            handelUpdateSetting('DISABLE_DEVTOOL', checked.toString())
                          }
                        />
                      </div>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space size='large'>
                      <div>
                        <Title level={5} className='mb-2'>
                          {t('SETTINGS.HIDE_SENSITIVE')}
                        </Title>
                        <Switch
                          checked={
                            settingData?.find((s: AppSetting) => s.key === 'HIDE_SENSITIVE_DATA')
                              ?.value === 'true'
                          }
                          onChange={(checked: boolean) =>
                            handelUpdateSetting('HIDE_SENSITIVE_DATA', checked.toString())
                          }
                        />
                      </div>
                    </Space>
                  </Col>
                </Row>

                <Row className='mt-6' gutter={[16, 16]}>
                  <Col span={12}>
                    <Space size='large'>
                      <div>
                        <Title level={5} className='mb-2'>
                          {t('SETTINGS.ENABLE_CALL')}
                        </Title>
                        <Switch
                          checked={
                            settingData?.find((s: AppSetting) => s.key === 'ENABLE_CALL')?.value ===
                            'true'
                          }
                          onChange={(checked: boolean) =>
                            handelUpdateSetting('ENABLE_CALL', checked.toString())
                          }
                        />
                      </div>
                    </Space>
                  </Col>
                </Row>
                {/* Scan attendance in selected semester */}
                <Row className={'mt-6'} gutter={[16, 16]}>
                  <Col span={12}>
                    <Title level={5} className='mb-2'>
                      {t('SETTINGS.SCAN_ATTENDANCE')}
                    </Title>
                    <Select
                      placeholder={t('COMMON.CHOOSE_SEMESTER')}
                      style={{ width: 200 }}
                      onChange={handleChange}
                    >
                      {semesters?.map((semester: Semester) => (
                        <Option key={semester.id} value={semester.semesterName}>
                          {semester.semesterName}
                        </Option>
                      ))}
                    </Select>
                    <Button type='primary' onClick={handleTrigger} className={'ml-0 md:ml-4 mt-2'}>
                      {t('COMMON.SCAN')}
                    </Button>
                  </Col>
                  <ScanDeferSetting />
                  <TrainingAiButton />
                </Row>
                <SignAsComponent />
              </>
            ),
            className: 'rounded-lg',
          },
        ]
      : []),
  ]
  return (
    <Card variant='outlined' className='p-4 rounded-lg shadow-md'>
      <Collapse
        defaultActiveKey={['personal', 'website']}
        expandIconPosition='end'
        className='rounded-lg'
        items={collapseItems}
      />
      {/* Image Preview Modal */}
      <ImagePreviewModal
        isVisible={isModalVisible}
        previewImage={previewImage}
        onSubmit={handleModalSubmit}
        onCancel={handleModalCancel}
        modalTitle={t('SETTINGS.PREVIEW_IMAGE')}
      />
    </Card>
  )
}
const UploadButton: FC = (): ReactElement => {
  const { t } = useTranslation()
  return (
    <div className='upload-placeholder'>
      <Button icon={<UploadOutlined />}>{t('SETTINGS.UPLOAD_IMAGE')}</Button>
    </div>
  )
}

export default Page
