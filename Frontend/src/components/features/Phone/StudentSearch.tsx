import React from 'react'
import { Button, Input, Divider, Typography, Empty } from 'antd'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import { StudentResponse } from '#src/types/ResponseModel/StudentResponse.js'
import { useTranslation } from 'react-i18next'

interface StudentSearchProps {
  student?: StudentResponse
  handleStudentCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  selectPhoneNumber: (phoneNumber: string) => void
}

const StudentSearch: React.FC<StudentSearchProps> = ({
  student,
  handleStudentCodeChange,
  selectPhoneNumber,
}) => {
  const { t } = useTranslation()
  return (
    <div className=' rounded-lg p-4 mb-6'>
      <Typography.Title level={5} className='mb-3'>
        <UserOutlined className='mr-2' />
        {t('COMMON.FIND_STUDENT')}
      </Typography.Title>

      <div className='flex gap-2 mb-4'>
        <Input
          placeholder={t('COMMON.ENTER_STUDENT_CODE')}
          onChange={handleStudentCodeChange}
          className='flex-1'
        />
        <Button type='primary' icon={<SearchOutlined />}>
          {t('COMMON.SEARCH')}
        </Button>
      </div>

      {student ? (
        <div className=' p-3 rounded-md'>
          <div className='mb-2'>
            <Typography.Text strong>{student.studentName}</Typography.Text>
            <div className=' text-sm'>{student.studentCode}</div>
          </div>

          <Divider className='my-2' />

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <div className='text-sm'>{t('COMMON.STUDENT_PHONE')}</div>
              <Button
                type='link'
                size='small'
                disabled={!student.mobilePhone || student.mobilePhone === 'N/A'}
                onClick={() => selectPhoneNumber(student.mobilePhone)}
                className='text-blue-600'
              >
                {student.mobilePhone}
              </Button>
            </div>

            <div className='flex justify-between items-center'>
              <div className='text-sm'>{t('COMMON.PARENT_PHONE')}</div>
              <Button
                type='link'
                size='small'
                disabled={!student.parentPhone || student.parentPhone === 'N/A'}
                onClick={() => selectPhoneNumber(student.parentPhone)}
                className='text-blue-600'
              >
                {student.parentPhone}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default StudentSearch
