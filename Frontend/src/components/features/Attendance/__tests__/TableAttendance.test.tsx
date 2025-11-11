import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TableAttendance from '../TableAttendance'
import * as attendanceDataHook from '#hooks/api/attendance/useAttendanceData.js'
import * as attendanceColumnHook from '../ColumnTableAttendance'
import { AttendanceListResponse } from '#types/ResponseModel/ApiResponse.js'
import { StudentProgress } from '#types/Enums/StudentProgress.js'

// Mock the imports
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { total?: number }) => {
      if (key === 'COMMON.TOTAL_RECORDS' && options?.total) {
        return `Total ${options.total} records`
      }
      return key
    },
  }),
}))

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...(actual as Record<string, unknown>),
    Grid: {
      useBreakpoint: vi.fn().mockReturnValue({
        xs: false,
        sm: true,
        md: true,
        lg: true,
        xl: true,
        xxl: true,
      }),
    },
    Table: ({
      dataSource,
      loading,
      pagination,
    }: {
      dataSource: AttendanceListResponse['items']
      loading?: boolean
      pagination?: {
        total: number
        defaultPageSize: number
        onChange: (page: number, pageSize: number) => void
      }
    }) => {
      return (
        <div data-testid='mock-table' className={loading ? 'ant-spin-blur' : ''}>
          <table role='table'>
            <tbody>
              {dataSource?.map((item) => (
                <tr key={item.id}>
                  <td>{item.student?.studentName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination && (
            <div data-testid='mock-pagination'>
              <span>Total {pagination.total} records</span>
              <button
                title='Next Page'
                onClick={() => pagination.onChange(2, pagination.defaultPageSize)}
              >
                Next
              </button>
              <div title='Page Size' data-testid='page-size-selector'>
                <div>
                  <div onClick={() => pagination.onChange(1, 20)}>20 / page</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
  }
})

// Mock the hooks
vi.mock('#hooks/api/attendance/useAttendanceData.js')
vi.mock('../ColumnTableAttendance', () => ({
  default: vi.fn().mockReturnValue([
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'ATTENDANCES.TABLE_COLUMN.STUDENT_NAME',
      dataIndex: 'student',
      key: 'studentName',
    },
  ]),
}))

// Mock data
const mockAttendanceData: AttendanceListResponse = {
  items: [
    {
      id: '1',
      student: {
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
      },
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
    },
    {
      id: '2',
      student: {
        id: 'student-2',
        studentName: 'Jane Smith',
        studentCode: 'ST002',
        mobilePhone: '987654321',
        major: 'Information Technology',
        class: 'IT202',
        email: 'jane.smith@example.com',
        isCurrentSemester: true,
        gender: 'Female',
        progress: 'Normal',
        statusCode: StudentProgress.TH,
        currentTermNo: 3,
        specialization: 'Database Management',
        parentPhone: '987654321',
      },
      className: 'IT202',
      semesterName: 'Spring 2025',
      currentTermNo: 3,
      updatedPeriod: '2025-03-21T11:00:00Z',
      totalAbsences: 2,
      totalSlots: 30,
      absenceRate: 6.67,
      isIncreased: false,
      subjectCode: 'IT202',
      image: '',
      numberOfEmails: 0,
    },
  ],
  totalItems: 2,
  pageSize: 10,
  totalPages: 1,
  pageIndex: 1,
  hasPreviousPage: false,
  hasNextPage: false,
  lastUpdated: '2025-03-26T10:00:00Z',
}

describe('TableAttendance Component', () => {
  const mockUseAttendanceData = vi.fn()
  const mockUseAttendanceColumn = vi.fn()

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Set up default mock implementations
    vi.mocked(attendanceDataHook.useAttendanceData).mockImplementation(mockUseAttendanceData)
    vi.mocked(attendanceColumnHook.default).mockImplementation(mockUseAttendanceColumn)

    // Default return values
    mockUseAttendanceData.mockReturnValue({
      data: mockAttendanceData,
      isFetching: false,
      error: null,
      isError: false,
      isLoading: false,
      isRefetching: false,
      isFetched: true,
      isFetchedAfterMount: true,
      refetch: vi.fn(),
      remove: vi.fn(),
      status: 'success',
    })

    mockUseAttendanceColumn.mockReturnValue([
      {
        title: '#',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'ATTENDANCES.TABLE_COLUMN.STUDENT_NAME',
        dataIndex: 'student',
        key: 'studentName',
      },
    ])
  })

  it('renders the table with data correctly', () => {
    mockUseAttendanceData.mockReturnValue({
      data: mockAttendanceData,
      isFetching: false,
      error: null,
      isError: false,
      isLoading: false,
      isRefetching: false,
      isFetched: true,
      isFetchedAfterMount: true,
      refetch: vi.fn(),
      remove: vi.fn(),
      status: 'success',
    })

    render(<TableAttendance filter={{ className: 'CS101' }} searchTerm='' />)

    // Check if the table is rendered
    expect(screen.getByTestId('mock-table')).toBeInTheDocument()

    // Check if data is displayed through mocked table
    const tableElement = screen.getByRole('table')
    expect(tableElement).toBeInTheDocument()
    expect(within(tableElement).getByText('John Doe')).toBeInTheDocument()
    expect(within(tableElement).getByText('Jane Smith')).toBeInTheDocument()

    // Check pagination info is displayed
    expect(screen.getByText('Total 2 records')).toBeInTheDocument()

    // Verify hooks were called with correct params
    expect(mockUseAttendanceData).toHaveBeenCalledWith('', { className: 'CS101' }, 1, 10)
    expect(mockUseAttendanceColumn).toHaveBeenCalled()
  })

  it('shows loading state when fetching data', () => {
    mockUseAttendanceData.mockReturnValue({
      data: undefined,
      isFetching: true,
      error: null,
      isError: false,
      isLoading: true,
      isRefetching: false,
      isFetched: false,
      isFetchedAfterMount: false,
      refetch: vi.fn(),
      remove: vi.fn(),
      status: 'loading',
    })

    render(<TableAttendance filter={{ className: 'CS101' }} searchTerm='' />)

    // Table should be in loading state
    const table = screen.getByTestId('mock-table')
    expect(table).toBeInTheDocument()
    expect(table).toHaveClass('ant-spin-blur')
  })

  it('updates page when pagination changes', async () => {
    const user = userEvent.setup()

    const extendedMockData: AttendanceListResponse = {
      ...mockAttendanceData,
      totalItems: 20,
      totalPages: 2,
      hasNextPage: true,
    }

    mockUseAttendanceData.mockReturnValue({
      data: extendedMockData,
      isFetching: false,
      error: null,
      isError: false,
      isLoading: false,
      isRefetching: false,
      isFetched: true,
      isFetchedAfterMount: true,
      refetch: vi.fn(),
      remove: vi.fn(),
      status: 'success',
    })

    render(<TableAttendance filter={{ className: 'CS101' }} searchTerm='' />)

    // Simulate pagination change
    const nextPageButton = screen.getByTitle('Next Page')
    await user.click(nextPageButton)

    // Second call should be with page 2
    expect(mockUseAttendanceData).toHaveBeenNthCalledWith(2, '', { className: 'CS101' }, 2, 10)
  })

  it('resets to first page when page size changes', async () => {
    const user = userEvent.setup()

    const extendedMockData: AttendanceListResponse = {
      ...mockAttendanceData,
      totalItems: 50,
      totalPages: 5,
      hasNextPage: true,
    }

    mockUseAttendanceData.mockReturnValue({
      data: extendedMockData,
      isFetching: false,
      error: null,
      isError: false,
      isLoading: false,
      isRefetching: false,
      isFetched: true,
      isFetchedAfterMount: true,
      refetch: vi.fn(),
      remove: vi.fn(),
      status: 'success',
    })

    render(<TableAttendance filter={{ className: 'CS101' }} searchTerm='' />)

    // Simulate change in page size
    const pageSizeSelector = screen.getByTestId('page-size-selector')
    const twentyPerPageOption = within(pageSizeSelector).getByText('20 / page')
    await user.click(twentyPerPageOption)

    // Second call should be with page 1 and size 20
    expect(mockUseAttendanceData).toHaveBeenNthCalledWith(2, '', { className: 'CS101' }, 1, 20)
  })

  it('updates search and filter parameters correctly', () => {
    // Test with different search term and filter
    render(
      <TableAttendance
        filter={{
          className: 'IT202',
          major: 'Information Technology',
        }}
        searchTerm='Smith'
      />,
    )

    // Verify hook called with correct search term and filter
    expect(mockUseAttendanceData).toHaveBeenCalledWith(
      'Smith',
      { className: 'IT202', major: 'Information Technology' },
      1,
      10,
    )
  })
})
