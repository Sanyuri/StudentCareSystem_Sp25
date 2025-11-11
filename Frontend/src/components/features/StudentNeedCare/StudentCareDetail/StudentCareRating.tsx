import ReactQuill from 'react-quill'
import Text from 'antd/es/typography/Text'
import { useTranslation } from 'react-i18next'
import { FC, ReactNode, useState } from 'react'
import { Button, Card, Tag, Radio } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import SanitizedHTML from '#components/common/SanitizedHTML.js'
import { StudentCareStatus } from '#utils/constants/studentCareStatus.js'
import { StudentNeedCareModel } from '#src/types/Data/StudentNeedCare.js'
import { useReactQuill } from '#components/common/react-quill/React-Quill.js'
import { StudentNeedCareUpdateRequest } from '#src/types/RequestModel/StudentNeedCareRequest.js'
import { useFinalEvaluateStudentCareMutation } from '#hooks/api/studentNeedCare/useStudentNeedCareMutation.js'
import useTemplateStore from '#stores/templateState.js'

interface StudentCareRatingProps {
  studentCareData: StudentNeedCareModel
}

const StudentCareRating: FC<StudentCareRatingProps> = ({
  studentCareData,
}: StudentCareRatingProps): ReactNode => {
  const { t } = useTranslation()
  const { darkMode } = useTemplateStore()
  const { quillRef } = useReactQuill()
  const [needCareNextTerm, setNeedCareNextTerm] = useState(studentCareData.needsCareNextTerm)
  const [finalComment, setFinalComment] = useState(studentCareData.finalComment || '')
  const [isProgressing, setIsProgressing] = useState(studentCareData.isProgressing)
  const [isCollaborating, setIsCollaborating] = useState(studentCareData.isCollaborating)
  const { mutate: finalEvaluateStudentCare } = useFinalEvaluateStudentCareMutation()

  const handleUpdate = async () => {
    const updateStudentCareData: StudentNeedCareUpdateRequest = {
      id: studentCareData.id,
      isProgressing,
      isCollaborating,
      needsCareNextTerm: needCareNextTerm,
      careStatus: StudentCareStatus.Done,
      finalComment,
    }
    finalEvaluateStudentCare(updateStudentCareData)
  }

  return (
    <Card
      title={
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center'>
            <FileTextOutlined style={{ marginRight: '8px' }} />
            <span className='text-lg font-semibold'>
              {t('STUDENT_NEED_CARE_DETAIL.RATING.TITLE')}
            </span>
          </div>
          <Tag
            className={`px-3 py-1 text-sm ${
              studentCareData.finalComment
                ? darkMode
                  ? 'bg-green-900 text-green-300 border-green-700'
                  : 'bg-green-50 text-green-600 border-green-200'
                : darkMode
                  ? 'bg-orange-900 text-orange-300 border-orange-700'
                  : 'bg-orange-50 text-orange-600 border-orange-200'
            }`}
          >
            <SanitizedHTML
              htmlContent={
                studentCareData.finalComment
                  ? t('STUDENT_NEED_CARE_DETAIL.RATING.RATED')
                  : t('STUDENT_NEED_CARE_DETAIL.RATING.NOT_RATED')
              }
            />
          </Tag>
        </div>
      }
      className={`shadow-md ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
    >
      <div className='space-y-6'>
        {/* Status Section */}
        <div className='grid grid-cols-3 gap-6'>
          <div
            className={`p-4 rounded-lg transition-all hover:shadow-md ${
              darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50'
            }`}
          >
            <Text strong className={`block mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              {t('STUDENT_NEED_CARE_DETAIL.RATING.PROGRESSING')}
            </Text>
            <Radio.Group
              value={isProgressing}
              onChange={(e) => setIsProgressing(e.target.value)}
              optionType='button'
              buttonStyle='solid'
              className={`w-full ${darkMode ? 'dark-radio-group' : ''}`}
            >
              <Radio.Button value={true} className='w-1/2 text-center'>
                {t('STUDENT_NEED_CARE_DETAIL.RATING.PROGRESSING_YES')}
              </Radio.Button>
              <Radio.Button value={false} className='w-1/2 text-center'>
                {t('STUDENT_NEED_CARE_DETAIL.RATING.PROGRESSING_NO')}
              </Radio.Button>
            </Radio.Group>
          </div>

          <div
            className={`p-4 rounded-lg transition-all hover:shadow-md ${
              darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50'
            }`}
          >
            <Text strong className={`block mb-3 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
              {t('STUDENT_NEED_CARE_DETAIL.RATING.COLLABORATOR')}
            </Text>
            <Radio.Group
              value={isCollaborating}
              onChange={(e) => setIsCollaborating(e.target.value)}
              optionType='button'
              buttonStyle='solid'
              className={`w-full ${darkMode ? 'dark-radio-group' : ''}`}
            >
              <Radio.Button value={true} className='w-1/2 text-center'>
                {t('STUDENT_NEED_CARE_DETAIL.RATING.COLLABORATOR_YES')}
              </Radio.Button>
              <Radio.Button value={false} className='w-1/2 text-center'>
                {t('STUDENT_NEED_CARE_DETAIL.RATING.COLLABORATOR_NO')}
              </Radio.Button>
            </Radio.Group>
          </div>

          <div
            className={`p-4 rounded-lg transition-all hover:shadow-md ${
              darkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50'
            }`}
          >
            <Text
              strong
              className={`block mb-3 ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}
            >
              {t('STUDENT_NEED_CARE_DETAIL.RATING.NEED_CARE_NEXT_TERM')}
            </Text>
            <Radio.Group
              value={needCareNextTerm}
              onChange={(e) => setNeedCareNextTerm(e.target.value)}
              optionType='button'
              buttonStyle='solid'
              className={`w-full ${darkMode ? 'dark-radio-group' : ''}`}
            >
              <Radio.Button value={true} className='w-1/2 text-center'>
                {t('STUDENT_NEED_CARE_DETAIL.RATING.NEED_CARE_NEXT_TERM_YES')}
              </Radio.Button>
              <Radio.Button value={false} className='w-1/2 text-center'>
                {t('STUDENT_NEED_CARE_DETAIL.RATING.NEED_CARE_NEXT_TERM_NO')}
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>

        {/* Editor Section */}
        <div className='my-6'>
          <Text strong className={`block mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('STUDENT_NEED_CARE_DETAIL.RATING.FINAL_COMMENT')}
          </Text>
          <div className={`h-[400px] relative ${darkMode ? 'quill-dark' : ''}`}>
            <ReactQuill
              ref={quillRef}
              value={finalComment}
              placeholder={`${t('EMAILTEMPLATES.FORM.PLACEHOLDER.CONTENT')}`}
              onChange={(e: string) => !studentCareData.finalComment && setFinalComment(e)}
              theme='snow'
              readOnly={!!studentCareData.finalComment}
              className='h-full [&_.ql-container]:!h-[calc(100%-42px)]'
            />
          </div>
        </div>

        {/* Actions Section */}
        <div
          className={`flex justify-between items-center pt-4 mt-4 border-t ${darkMode ? 'border-gray-700' : ''}`}
        >
          <div className='space-x-4'>
            {!studentCareData.finalComment && (
              <Button
                type='primary'
                size='large'
                onClick={handleUpdate}
                className='bg-blue-500 hover:bg-blue-600'
              >
                {t('STUDENT_NEED_CARE_DETAIL.RATING.SAVE_COMMENT')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default StudentCareRating
