/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import AttendanceFilterComponent from '../AttendanceFilter'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the dependencies
vi.mock('react-i18next', () => ({
  // This mock makes t() return the key as-is
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('#hooks/notes/useNoteStateList.js', () => ({
  useNoteStateList: () => [
    { value: -1, label: 'All' },
    { value: 0, label: 'Not noted' },
    { value: 1, label: 'Noted' },
  ],
}))

vi.mock('#utils/constants/semestersList.js', () => ({
  semesters: [
    { value: 1, label: 'Semester 1' },
    { value: 2, label: 'Semester 2' },
    { value: 3, label: 'Semester 3' },
  ],
}))

// Simple mock for dayjs
vi.mock('dayjs', () => {
  const mockDayjs = (date: any) => {
    return {
      format: () => '2025-03-01',
    }
  }
  mockDayjs.Dayjs = class Dayjs {}
  return { default: mockDayjs }
})

// Mock Ant Design components
vi.mock('antd', () => {
  return {
    Drawer: ({
      children,
      open,
      onClose,
      title,
    }: {
      children: React.ReactNode
      open: boolean
      onClose: () => void
      title: string
    }) =>
      open ? (
        <div data-testid='mock-drawer'>
          <div data-testid='drawer-title'>{title}</div>
          <div data-testid='drawer-content'>{children}</div>
          <button data-testid='drawer-close' onClick={onClose}>
            Close
          </button>
        </div>
      ) : null,
    InputNumber: ({
      value,
      onChange,
      placeholder,
    }: {
      value: number | null | undefined
      onChange: (value: number | null) => void
      placeholder: string
    }) => (
      <input
        data-testid={`input-number-${placeholder}`}
        type='number'
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        placeholder={placeholder}
      />
    ),
    Input: ({
      value,
      onChange,
      placeholder,
    }: {
      value: string
      onChange: (e: { target: { value: string } }) => void
      placeholder: string
    }) => (
      <input
        data-testid={`input-${placeholder}`}
        type='text'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    ),
    Select: ({
      value,
      onChange,
      options,
      placeholder,
    }: {
      value: any
      onChange: (value: any) => void
      options: Array<{ value: any; label: string }>
      placeholder: string
    }) => (
      <select
        data-testid={`select-${placeholder}`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ),
    DatePicker: {
      RangePicker: ({ onChange }: { onChange: (dates: [any, any]) => void }) => (
        <div data-testid='mock-range-picker'>
          <button
            data-testid='date-picker-btn'
            onClick={() => onChange([dayjs('2025-03-01'), dayjs('2025-03-31')])}
          >
            Select Date Range
          </button>
        </div>
      ),
    },
    Button: ({
      children,
      onClick,
      type,
      danger,
    }: {
      children: React.ReactNode
      onClick: () => void
      type?: string
      danger?: boolean
    }) => (
      <button data-testid={`button-${danger ? 'reset' : type || 'default'}`} onClick={onClick}>
        {children}
      </button>
    ),
    Row: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='mock-row'>{children}</div>
    ),
    Col: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='mock-col'>{children}</div>
    ),
  }
})

describe('AttendanceFilterComponent', () => {
  const mockOnClose = vi.fn()
  const mockOnFilterChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly when open', () => {
    render(
      <AttendanceFilterComponent
        open={true}
        onClose={mockOnClose}
        onFilterChange={mockOnFilterChange}
      />,
    )

    // Drawer should be rendered
    expect(screen.getByTestId('mock-drawer')).toBeInTheDocument()

    // Title should be present
    expect(screen.getByTestId('drawer-title')).toBeInTheDocument()

    // Filter and Reset buttons should be present
    expect(screen.getByTestId('button-reset')).toBeInTheDocument()
    expect(screen.getByTestId('button-primary')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <AttendanceFilterComponent
        open={false}
        onClose={mockOnClose}
        onFilterChange={mockOnFilterChange}
      />,
    )

    // Drawer should not be rendered
    expect(screen.queryByTestId('mock-drawer')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <AttendanceFilterComponent
        open={true}
        onClose={mockOnClose}
        onFilterChange={mockOnFilterChange}
      />,
    )

    // Click the close button
    await user.click(screen.getByTestId('drawer-close'))

    // onClose should be called
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
