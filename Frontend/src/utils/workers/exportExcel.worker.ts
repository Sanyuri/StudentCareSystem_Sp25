import { HeaderFile } from '#src/types/Data/HeaderFile.js'
import { createExcelFile, formatData } from '#utils/helper/exportExcel.js'

// Worker to create xlsx file
self.onmessage = <T extends Record<string, unknown>>(
  event: MessageEvent<{
    data: T[]
    headers: HeaderFile[]
    fileName: string
    keysToFormat?: string[]
  }>,
): void => {
  const { data: jsonData, headers, fileName, keysToFormat } = event.data
  const formattedData: Record<string, string | number>[] = formatData(
    jsonData,
    headers,
    keysToFormat,
  )
  const fileBlob: Blob = createExcelFile(formattedData, headers)
  self.postMessage({ blob: fileBlob, fileName })
}
