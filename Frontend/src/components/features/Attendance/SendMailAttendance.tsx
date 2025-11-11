import { Button } from 'antd'
import icon from '#utils/constants/icon.js'
import { useTranslation } from 'react-i18next'
import { StudentAttendance } from '#src/types/ResponseModel/ApiResponse.js'
import EmailSend from '#assets/icon/email send.svg?react'
const SendNotifyAttendance = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  studentData,
  type,
}: {
  studentData: StudentAttendance
  type: string
}) => {
  // const title = `Thông báo qua ${type}`
  // const [isModalOpen, setIsModalOpen] = useState(false)
  // const [loading, setLoading] = useState(false)
  // const [form] = Form.useForm()
  // const { data, isLoading , isError} = useEmailTemplate()

  const { t } = useTranslation()
  // const [selectedTemplate, setSelectedTemplate] = useState<{
  //   subject: string
  //   content: string
  // } | null>(null)

  const showModal = () => {
    // setIsModalOpen(true)
  }

  // const handleOk = () => {
  //   form.submit()
  // }

  // const handleCancel = () => {
  //   setIsModalOpen(false)
  // }

  // const handleTemplateChange = (value: string) => {
  //   const selected = data?.find((template) => template.id === value)

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

  // const onFinish = async (values: NotifyRequest) => {
  //   try {
  //     setLoading(true)
  //     const request: NotifyToStudent = {
  //       userId: studentData.studentId,
  //       type: type,
  //       values: values,
  //     }
  //     await agent.Notify.sendNotify(request)
  //     setIsModalOpen(false)
  //     toast.success('Gửi thông báo thành công')
  //   } catch (error) {
  //     toast.error('Gửi thông báo thất bại')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // if (isLoading) {
  //   if (type === 'Email') {
  //     return (
  //       <a onClick={showModal}>
  //         <img src={icon.emailSend} title='Send email' width={'25px'} height={'25px'} />
  //       </a>
  //     )
  //   }
  //   return (
  //     <a onClick={showModal}>
  //       <img src={icon.wifiPhone} title='Send FAP' width={'25px'} height={'25px'} />
  //     </a>
  //   )
  // }

  // const emailTemplateOptions = convertToSelectOption(data)

  // if(isError){
  //   return <></>
  // }

  return (
    <>
      {type === 'Email' ? (
        <Button onClick={showModal} ghost icon={<EmailSend />} />
      ) : (
        <Button
          onClick={showModal}
          ghost
          icon={
            <img
              src={icon.wifiPhone}
              title={t('COMMON.SEND_FAP')}
              className='w-[25px] h-[25px]'
              alt={t('COMMON.SEND_FAP')}
            />
          }
        />
      )}
      {/* <Modal
        style={{ top: 0 }}
        width={800}
        forceRender
        title={title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        footer={() => (
          <div className="flex gap-2.5">
            <CancelNotify onCancel={handleCancel} />
            <Button
              type='primary'
              onClick={handleOk}
              style={{ flex: 1, padding: '0 8px', height: '45px' }}
              loading={loading}
            >
              Xác nhận
            </Button>
          </div>
        )}
      >
        <section className='flex flex-col justify-center p-4 rounded-xl border border-solid bg-neutral-50 border-zinc-100 max-w-[720px]'>
          <div className='flex flex-wrap gap-3 items-center w-full max-md:max-w-full'>
            <img
              src={studentData.image}
              alt='User avatar'
              width={40}
              height={40}
              className='object-contain shrink-0 self-stretch my-auto w-12 aspect-square rounded-[999px]'
            />
            <div className='flex flex-col self-stretch my-auto'>
              <div className='flex gap-5 items-start text-sm font-semibold leading-6 text-gray-900'>
                <span>{studentData.name}</span>
                <span>{studentData.studentId}</span>
              </div>
              <div className='mt-1 text-xs font-medium leading-none text-neutral-500'>
                {studentData.email}
              </div>
            </div>
          </div>
        </section>
        <Form
          form={form}
          layout='vertical'
          initialValues={{
            emailTemplate: emailTemplateOptions[0]?.value,
            notificationChannel:
              type === 'Email' ? notificationChannel[1].label : notificationChannel[2].label,
            notificationGroup: notificationGroup[0]?.value,
          }}
          onFinish={onFinish}
        >
          <Form.Item required label='Mẫu email' name='emailTemplate'>
            <Select options={emailTemplateOptions} onChange={handleTemplateChange} />
          </Form.Item>
          <Form.Item required label='Hình thức thông báo qua kênh' name='notificationChannel'>
            <Select options={notificationChannel} />
          </Form.Item>
          <Form.Item required label='Hình thức' name='notificationGroup'>
            <Select options={notificationGroup} />
          </Form.Item>
          <Form.Item
            required
            rules={[
              {
                type: 'email',
                message: 'Hãy điền email hợp lệ',
              },
              { required: true, message: 'Nhập địa chỉ phản hồi' },
            ]}
            label='Địa chỉ email nhận phản hồi'
            name='replyToEmail'
          >
            <Input required placeholder='Nhập địa chỉ phản hồi' />
          </Form.Item>
          <Form.Item
            required
            label='Chủ đề'
            rules={[{ required: true, message: 'Nhập chủ đề' }]}
            name='subject'
          >
            <Input required placeholder='Nhập chủ đề' />
          </Form.Item>
          <Form.Item
            required
            label='Nội dung'
            rules={[{ required: true, message: 'Nhập nội dung' }]}
            name='content'
          >
            <TextArea required rows={6} placeholder='Nhập nội dung' />
          </Form.Item>
        </Form>
      </Modal> */}
    </>
  )
}

export default SendNotifyAttendance
