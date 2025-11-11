// import { Button, Form, Input, Modal, Select } from 'antd'
// import React, { useState, useEffect } from 'react'
// import TextArea from 'antd/es/input/TextArea'
// import { useEmailTemplate } from '#hooks/react-query/useEmailTemplate.js'
// import { convertToSelectOption } from '#utils/helper/convertToSelectOption.js'
// import CancelNotify from '#components/common/CancelNotify/CancelNotify.js'
// import { notificationChannel, notificationGroup } from '#utils/constants/notification.js'
import { useState } from 'react'
import EmailSend from '#assets/icon/email send.svg?react'
const SendMultiMailAttendance = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [loading, setLoading] = useState(false)
  // const [form] = Form.useForm()
  // // const { data, isLoading, isError } = useEmailTemplate()
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [selectedTemplate, setSelectedTemplate] = useState<{
  //   subject: string
  //   content: string
  // } | null>(null)
  //
  const showModal = () => {
    setIsModalOpen(true)
  }
  //
  // const handleOk = () => {
  //   form.submit()
  // }
  //
  // const handleCancel = () => {
  //   setIsModalOpen(false)
  // }
  //
  // const handleTemplateChange = (value: string) => {
  //   const selected = data?.find(
  //     (template: { id: string; subject: string; content: string }) => template.id === value,
  //   )
  //
  //   if (selected) {
  //     setSelectedTemplate({
  //       subject: selected.subject,
  //       content: selected.content,
  //     })
  //     form.setFieldsValue({
  //       emailTemplate: value,
  //       subject: selected.subject,
  //       content: selected.content,
  //     })
  //   }
  // }
  //
  // useEffect(() => {
  //   if (data && data.length > 0) {
  //     const initialTemplate = data[0]
  //     form.setFieldsValue({
  //       emailTemplate: initialTemplate.id,
  //       subject: initialTemplate.subject,
  //       content: initialTemplate.content,
  //     })
  //     setSelectedTemplate({
  //       subject: initialTemplate.subject,
  //       content: initialTemplate.content,
  //     })
  //   }
  // }, [data, form])
  //
  // const onFinish = async (values: NotifyRequest) => {
  //   try {
  //     setLoading(true)
  //     await NotifyService.sendNotifyAll(values)
  //     setIsModalOpen(false)
  //     toast.success('Gửi thông báo thành công')
  //   } catch (error) {
  //     toast.error('Gửi thông báo thất bại')
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  //
  // if (isError) {
  //   return <></>
  // }
  //
  // if (isLoading) {
  //   return (
  //     <button
  //       onClick={showModal}
  //       className='flex overflow-hidden gap-2 justify-center items-center self-stretch px-4 py-2 my-auto font-semibold text-blue-700 bg-white rounded-xl border-2 border-blue-400 border-solid shadow-sm'
  //     >
  //       <img
  //         loading='lazy'
  //         src={icon.emailSendBlue}
  //         alt=''
  //         className='object-contain shrink-0 self-stretch my-auto w-6 aspect-square'
  //       />
  //       <span>Gửi hàng loạt</span>
  //     </button>
  //   )
  // }
  //
  // const emailTemplateOptions = data ? convertToSelectOption(data) : []

  return (
    <>
      <button
        onClick={showModal}
        className='flex overflow-hidden gap-2 justify-center items-center self-stretch px-4 py-2 my-auto font-semibold text-blue-700 bg-white rounded-xl border-2 border-blue-400 border-solid shadow-sm'
      >
        <EmailSend />
        Gửi hàng loát
        <span>Gửi hàng loạt</span>
      </button>
      {/*<Modal*/}
      {/*  style={{ top: 0 }}*/}
      {/*  width={800}*/}
      {/*  forceRender*/}
      {/*  title='Gửi hàng loạt'*/}
      {/*  open={isModalOpen}*/}
      {/*  onOk={handleOk}*/}
      {/*  onCancel={handleCancel}*/}
      {/*  confirmLoading={loading} // Hiển thị trạng thái loading khi đang gọi API*/}
      {/*  footer={() => (*/}
      {/*    <div className='flex gap-2.5'>*/}
      {/*      <CancelNotify onCancel={handleCancel} />*/}
      {/*      <Button*/}
      {/*        type='primary'*/}
      {/*        onClick={handleOk}*/}
      {/*        style={{ flex: 1, padding: '0 8px', height: '45px' }}*/}
      {/*        loading={loading} // Hiển thị trạng thái loading khi đang gọi API*/}
      {/*      >*/}
      {/*        Xác nhận*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*>*/}
      {/*  <Form*/}
      {/*    form={form} // Truyền form instance vào prop form của Form component*/}
      {/*    layout='vertical'*/}
      {/*    initialValues={{*/}
      {/*      emailTemplate: !(!emailTemplateOptions?.[0]?.value && !''),*/}
      {/*      notificationChannel: notificationChannel[0]?.value,*/}
      {/*      notificationGroup: notificationGroup[0]?.value,*/}
      {/*    }}*/}
      {/*    onFinish={onFinish} // Gọi hàm onFinish khi submit form*/}
      {/*  >*/}
      {/*    <Form.Item required label='Mẫu email' name='emailTemplate'>*/}
      {/*      <Select options={emailTemplateOptions || undefined} onChange={handleTemplateChange} />*/}
      {/*    </Form.Item>*/}
      {/*    <Form.Item required label='Hình thức thông báo qua kênh' name='notificationChannel'>*/}
      {/*      <Select options={notificationChannel} />*/}
      {/*    </Form.Item>*/}
      {/*    <Form.Item required label='Hình thức' name='notificationGroup'>*/}
      {/*      <Select options={notificationGroup} />*/}
      {/*    </Form.Item>*/}
      {/*    <Form.Item*/}
      {/*      required*/}
      {/*      rules={[*/}
      {/*        {*/}
      {/*          type: 'email',*/}
      {/*          message: 'Hãy điền email hợp lệ',*/}
      {/*        },*/}
      {/*        { required: true, message: 'Nhập địa chỉ phản hồi' },*/}
      {/*      ]}*/}
      {/*      label='Địa chỉ email nhận phản hồi'*/}
      {/*      name='replyToEmail'*/}
      {/*    >*/}
      {/*      <Input required placeholder='Nhập địa chỉ phản hồi' />*/}
      {/*    </Form.Item>*/}
      {/*    <Form.Item*/}
      {/*      required*/}
      {/*      label='Chủ đề'*/}
      {/*      rules={[{ required: true, message: 'Nhập chủ đề' }]}*/}
      {/*      name='subject'*/}
      {/*    >*/}
      {/*      <Input required placeholder='Nhập chủ đề' />*/}
      {/*    </Form.Item>*/}
      {/*    <Form.Item*/}
      {/*      required*/}
      {/*      label='Nội dung'*/}
      {/*      rules={[{ required: true, message: 'Nhập nội dung' }]}*/}
      {/*      name='content'*/}
      {/*    >*/}
      {/*      <TextArea required rows={6} placeholder='Nhập nội dung' />*/}
      {/*    </Form.Item>*/}
      {/*  </Form>*/}
      {/*</Modal>*/}
    </>
  )
}

export default SendMultiMailAttendance
