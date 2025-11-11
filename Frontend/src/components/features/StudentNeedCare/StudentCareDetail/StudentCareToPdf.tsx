import dayjs from 'dayjs'
import { Button } from 'antd'
import { meanBy } from 'lodash'
import { FC, ReactNode } from 'react'
import pdfMake from 'pdfmake/build/pdfmake.js'
import { useTranslation } from 'react-i18next'
import { FilePdfOutlined } from '@ant-design/icons'
import { StudentCareComparisonData } from '#src/types/Data/StudentNeedCare.js'
import { Content as ContentPDF, ContentTable, TDocumentDefinitions } from 'pdfmake/interfaces.js'
import { DATE_FORMAT_FILE_NAME_EXPORT } from '#src/configs/WebConfig.js'

interface StudentCareToPdfProps {
  studentName: string
  mergedStudentData: StudentCareComparisonData[]
}

const StudentCareToPdf: FC<StudentCareToPdfProps> = ({
  studentName,
  mergedStudentData,
}: StudentCareToPdfProps): ReactNode => {
  const { t } = useTranslation()
  const exportToPDF = () => {
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: t('EXPORT_PDF.STUDENT_RECORD'), style: 'header' },
        ...mergedStudentData.map((studentRecord) => ({
          stack: [
            {
              text: `${t('EXPORT_PDF.SEMESTER')} ${studentRecord.semesterName}`,
              style: 'subheader',
              margin: [0, 10, 0, 5],
              alignment: 'center',
            },
            {
              table: {
                widths: ['50%', '50%'],
                body: [
                  [
                    {
                      text: `GPA: ${
                        meanBy(
                          studentRecord.subjects.filter((s) => s.averageMark !== undefined),
                          'averageMark',
                        )?.toFixed(2) || '0.00'
                      }`,
                      style: 'stat',
                      alignment: 'center',
                    },
                    {
                      text: `${t('EXPORT_PDF.ABSENCE_AVERAGE_RATE')} ${
                        studentRecord.subjects.some((s) => s.absenceRate !== undefined)
                          ? meanBy(
                              studentRecord.subjects.filter((s) => s.absenceRate !== undefined),
                              'absenceRate',
                            )?.toFixed(2)
                          : '0.00'
                      }%`,
                      style: 'stat',
                      alignment: 'center',
                    },
                  ],
                ],
              },
              layout: 'noBorders',
              margin: [0, 5],
            } as ContentTable,
            {
              table: {
                headerRows: 1,
                widths: ['40%', '30%', '30%'],
                body: [
                  [
                    { text: t('EXPORT_PDF.SUBJECT'), style: 'tableHeader' },
                    { text: t('EXPORT_PDF.MARK'), style: 'tableHeader' },
                    { text: t('EXPORT_PDF.ABSENCE_RATE'), style: 'tableHeader' },
                  ],
                  ...studentRecord.subjects.map((s) => [
                    { text: s.subjectCode || '-', alignment: 'center' },
                    {
                      text: s.averageMark !== undefined ? s.averageMark.toFixed(2) : '-',
                      color: s.averageMark !== undefined && s.averageMark < 5 ? 'red' : 'green',
                      alignment: 'center',
                    },
                    {
                      text: s.absenceRate !== undefined ? `${s.absenceRate.toFixed(2)}%` : '-',
                      color: s.absenceRate !== undefined && s.absenceRate > 20 ? 'red' : 'green',
                      alignment: 'center',
                    },
                  ]),
                ],
              },
              layout: 'lightHorizontalLines',
              margin: [0, 10],
            } as ContentTable,
          ] as ContentPDF[],
        })),
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        stat: { fontSize: 12, bold: true, margin: [0, 5] },
        tableHeader: { bold: true, fillColor: '#f2f2f2', alignment: 'center' },
      },
    }
    pdfMake
      .createPdf(docDefinition)
      .download(`${studentName}_comparisons__${dayjs().format(DATE_FORMAT_FILE_NAME_EXPORT)}.pdf`)
  }
  return (
    <Button
      onClick={exportToPDF}
      icon={<FilePdfOutlined />}
      className='bg-green-600 hover:bg-green-700 text-white flex items-center'
      style={{
        borderRadius: '6px',
        border: 'none',
        boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
      }}
    >
      <span className='ml-1'>{t('STUDENT_NEED_CARE_DETAIL.PDF.BUTTON')}</span>
    </Button>
  )
}

export default StudentCareToPdf
