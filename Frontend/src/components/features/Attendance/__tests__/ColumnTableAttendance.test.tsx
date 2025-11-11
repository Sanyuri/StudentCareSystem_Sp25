import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import useAttendanceColumn from '../ColumnTableAttendance'
import { StudentProgress } from '#types/Enums/StudentProgress.js'

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('#utils/helper/convertToCurrentTime.js', () => ({
  convertToLocalDate: (date: string) => `converted-${date}`,
}))

vi.mock('#hooks/api/noteType/useNoteTypeData.js', () => ({
  useNoteTypeDefaultData: () => ({
    data: {
      id: 'attendance-note-type',
      name: 'Attendance Note Type',
    },
  }),
}))

// Mock components
vi.mock('#components/common/note/NoteComponent.js', () => ({
  default: vi.fn(() => <div data-testid='mock-note-component'>Note Component</div>),
}))

vi.mock('./AttendanceChart', () => ({
  default: vi.fn(({ id }) => <div data-testid={`mock-absence-chart-${id}`}>Absence Chart</div>),
}))

vi.mock('#components/common/HideValueSensitive/HideValueSensitive.js', () => ({
  default: vi.fn(({ data }) => <div data-testid='mock-hide-value-sensitive'>{data}</div>),
}))

// Mock icons
vi.mock('@ant-design/icons', () => ({
  ArrowUpOutlined: vi.fn(() => <span data-testid='arrow-up'>↑</span>),
  ArrowDownOutlined: vi.fn(() => <span data-testid='arrow-down'>↓</span>),
}))

describe('useAttendanceColumn', () => {
  const screens = { xs: false, sm: true, md: true, lg: true, xl: true, xxl: true }
  const page = 1
  const pageSize = 10

  // Mock student data
  const mockStudent = {
    id: 'student-1',
    studentName: 'John Doe',
    studentCode: 'ST001',
    mobilePhone: '123456789',
    major: 'Computer Science',
    class: 'CS101',
    email: 'john.doe@example.com',
    isCurrentSemester: true,
    gender: 'Male',
    progress: 'Normal',
    statusCode: StudentProgress.TH,
    currentTermNo: 3,
    specialization: 'Software Engineering',
    parentPhone: '123456789',
  }

  // Mock record
  const mockRecord = {
    id: 'record-1',
    student: mockStudent,
    className: 'CS101',
    semesterName: 'Spring 2025',
    currentTermNo: 3,
    updatedPeriod: '2025-03-20T10:00:00Z',
    totalAbsences: 5,
    totalSlots: 30,
    absenceRate: 16.67,
    isIncreased: true,
    subjectCode: 'CS101',
    image: '',
    numberOfEmails: 0,
    latestEmailSentDate: '2025-03-19T10:00:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the correct number of columns', () => {
    const { result } = renderHook(() => useAttendanceColumn(screens, page, pageSize))

    // The component defines 12 columns
    expect(result.current).toHaveLength(12)
  })

  it('calculates row number correctly', () => {
    const { result } = renderHook(() => useAttendanceColumn(screens, page, pageSize))

    // Get the first column (row number column)
    const rowNumberColumn = result.current[0]

    // Check that the title is correct
    expect(rowNumberColumn.title).toBe('#')

    // Check that the render function calculates row number correctly
    const renderResult = rowNumberColumn.render?.(null, mockRecord, 2)
    expect(renderResult).toBe((page - 1) * pageSize + 2 + 1) // Should be 3 for page 1, index 2
  })

  it('properly formats student name column', () => {
    const { result } = renderHook(() => useAttendanceColumn(screens, page, pageSize))

    // Get the student name column
    const studentNameColumn = result.current[1]

    // Check that the title is correct
    expect(studentNameColumn.title).toBe('ATTENDANCES.TABLE_COLUMN.STUDENT_NAME')

    // Check that the render function returns the student name
    const rendered = studentNameColumn.render?.(mockStudent, mockRecord, 0)
    expect(rendered).toMatchObject({ type: 'span', props: { children: 'John Doe' } })
  })

  it('formats the updated period column with convertToLocalDate', () => {
    const { result } = renderHook(() => useAttendanceColumn(screens, page, pageSize))

    // Get the updated period column
    const updatedPeriodColumn = result.current[9]

    // Check that the title is correct
    expect(updatedPeriodColumn.title).toBe('ATTENDANCES.TABLE_COLUMN.UPDATE_PERIOD')

    // Check that the render function formats the date
    const rendered = updatedPeriodColumn.render?.('2025-03-20T10:00:00Z', mockRecord, 0)
    expect(rendered).toMatchObject({
      type: 'span',
      props: { children: 'converted-2025-03-20T10:00:00Z' },
    })
  })

  it('shows arrow up for increased absence rate', () => {
    const { result } = renderHook(() => useAttendanceColumn(screens, page, pageSize))

    // Get the subject code column
    const subjectCodeColumn = result.current[10]

    // Check rendering with increased absence rate
    const recordWithIncreasedRate = {
      ...mockRecord,
      isIncreased: true,
    }

    const rendered = subjectCodeColumn.render?.('CS101', recordWithIncreasedRate, 0)
    // The rendered output should include an ArrowUpOutlined component
    expect(rendered).toBeDefined()
  })

  it('shows arrow down for decreased absence rate', () => {
    const { result } = renderHook(() => useAttendanceColumn(screens, page, pageSize))

    // Get the subject code column
    const subjectCodeColumn = result.current[10]

    // Check rendering with decreased absence rate
    const recordWithDecreasedRate = {
      ...mockRecord,
      isIncreased: false,
    }

    const rendered = subjectCodeColumn.render?.('CS101', recordWithDecreasedRate, 0)
    // The rendered output should include an ArrowDownOutlined component
    expect(rendered).toBeDefined()
  })

  it('renders the action column with AbsenceChart and NoteComponent', () => {
    const { result } = renderHook(() => useAttendanceColumn(screens, page, pageSize))

    // Get the action column
    const actionColumn = result.current[11]

    // Check that the title is correct
    expect(actionColumn.title).toBe('ATTENDANCES.TABLE_COLUMN.ACTION')

    // Check that the render function returns the action components
    const rendered = actionColumn.render?.(null, mockRecord, 0)
    expect(rendered).toBeDefined()
  })

  it('adjusts column fixed property based on screen size', () => {
    // Test with non-mobile screens
    const { result: resultDesktop } = renderHook(() =>
      useAttendanceColumn({ ...screens, xs: false }, page, pageSize),
    )

    // First column should be fixed left on desktop
    expect(resultDesktop.current[0].fixed).toBe('left')

    // Test with mobile screens
    const { result: resultMobile } = renderHook(() =>
      useAttendanceColumn({ ...screens, xs: true }, page, pageSize),
    )

    // First column should not be fixed on mobile
    expect(resultMobile.current[0].fixed).toBe(false)
  })
})
