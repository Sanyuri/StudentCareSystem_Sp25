import * as XLSX from 'xlsx'
import { HeaderFile } from '#types/Data/HeaderFile.js'
import { WorkBook, WorkSheet } from 'xlsx'

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
    ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
    : ''
}

export function formatData<T extends Record<string, unknown>>(
  jsonData: T[],
  headers: HeaderFile[],
  keysToFormat?: string[],
): Record<string, string | number>[] {
  if (jsonData.length === 0) return [{} as Record<string, string | number>]

  return jsonData.map((item: T): Record<string, string | number> => {
    const formattedItem: Record<string, string | number> = {}
    headers.forEach((header: HeaderFile) => {
      const value: unknown = getNestedValue(item, header.key)
      if (keysToFormat?.includes(header.key)) {
        formattedItem[header.key] = formatDate(value as string)
      } else {
        formattedItem[header.key] =
          typeof value === 'string' || typeof value === 'number' ? value : ''
      }
    })
    return formattedItem
  })
}

function getNestedValue<T>(obj: T, path: string): unknown {
  return path.split('.').reduce<unknown>((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createWorksheet<T extends Record<string, any>>(
  data: Record<string, string | number>[],
  headers: { header: string; key: keyof T }[],
): XLSX.WorkSheet {
  const ws: WorkSheet = XLSX.utils.json_to_sheet([])

  // Add header row
  const headerRow: string[] = headers.map((header) => header.header)
  XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 'A1' })

  // Add data rows
  const dataRows = data.map((item) =>
    headers.map((header) => ({
      v: item[header.key as string] || '',
      s: {
        alignment: { horizontal: 'center', vertical: 'center' },
      },
    })),
  )
  XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: -1 })

  // Adjust column widths
  ws['!cols'] = headers.map((header) => {
    let maxLength: number = header.header.length
    data.forEach((item) => {
      const cellValue: string | number = item[header.key as string]
      if (cellValue && cellValue.toString().length > maxLength) {
        maxLength = cellValue.toString().length
      }
    })
    return { wpx: Math.min(maxLength * 10, 300) }
  })

  return ws
}

export function createExcelFile<T extends Record<string, unknown>>(
  data: Record<string, string | number>[],
  headers: { header: string; key: keyof T }[],
): Blob {
  const ws: WorkSheet = createWorksheet(data, headers)
  const wb: WorkBook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Export Data')
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  return new Blob([excelBuffer], { type: 'application/octet-stream' })
}

export const formattedSemestersFileName = (semesters: string): string => {
  const semestersArray: string[] = semesters.split(',')
  const firstSemester: string = semestersArray[semestersArray.length - 1]
  const lastSemester: string = semestersArray[0]
  return `${firstSemester}_${lastSemester}`
}
