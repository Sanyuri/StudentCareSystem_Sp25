/* eslint-disable @typescript-eslint/no-explicit-any */
import { from, lastValueFrom, map, mergeMap, Observable, toArray } from 'rxjs'
import { EXPORT_API_CALL_STREAM_NUMBER, PAGE_SIZE_EXPORT_DIVIDED } from '#src/configs/WebConfig.js'
import { NoteService } from '#src/services/NoteService.js'
import { StudentNoteListResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { NoteModel } from '#src/types/Data/NoteModel.js'

type ApiMapping = ReturnType<typeof handleApiMapping>
type ApiMappingKey = keyof ApiMapping

// Ánh xạ option tới API và tham số tương ứng
const handleApiMapping = (noteTypeIds: string[]) => {
  const mapping: Record<
    string,
    {
      apiFunction: (params: any) => Promise<StudentNoteListResponse>
      params: any
    }
  > = {}

  // Tạo mapping cho mỗi loại note
  noteTypeIds.forEach((id) => {
    mapping[id] = {
      apiFunction: async (params: any): Promise<StudentNoteListResponse> => {
        const response = await NoteService.list(params)
        return response
      },
      params: { noteTypeId: id },
    }
  })

  return mapping
}

// Hàm chung để gọi API và xử lý phân trang
const fetchPaginatedData = async (
  apiFunction: (params: any) => Promise<StudentNoteListResponse>,
  apiParams: any,
): Promise<NoteModel[]> => {
  const initialResponse = await apiFunction({ ...apiParams, pageNumber: 1, pageSize: 1 })
  const totalItems: number = initialResponse?.totalItems || 0
  const totalPages: number = Math.ceil(totalItems / PAGE_SIZE_EXPORT_DIVIDED)

  if (totalPages === 0) {
    return []
  }

  return await lastValueFrom(
    from(Array.from({ length: totalPages }, (_, i: number) => i + 1)).pipe(
      mergeMap(
        (pageNumber: number) =>
          apiFunction({ ...apiParams, pageNumber, pageSize: PAGE_SIZE_EXPORT_DIVIDED }).then(
            (response: StudentNoteListResponse) => response.items,
          ),
        EXPORT_API_CALL_STREAM_NUMBER,
      ),
      toArray(),
      map((pages: NoteModel[][]) => pages.flat()),
    ),
  )
}

export const fetchNoteDataForItem = (
  selectedItem: string,
  noteTypeIds: string[],
  additionalParams?: {
    semesterName?: string | null
    fromDate?: string | null
    toDate?: string | null
  },
): Observable<NoteModel[]> => {
  return from(
    (async () => {
      const apiMapping = handleApiMapping(noteTypeIds)
      const mapping = apiMapping[selectedItem as ApiMappingKey]
      if (!mapping || !(selectedItem in apiMapping)) {
        return []
      }
      const { apiFunction, params: mappingParams } = mapping

      // Kết hợp params từ mapping và additionalParams
      const combinedParams = { ...mappingParams }

      // Thêm các tham số bổ sung nếu có
      if (additionalParams?.semesterName) {
        combinedParams.semesterName = additionalParams.semesterName
      }

      if (additionalParams?.fromDate) {
        combinedParams.fromDate = additionalParams.fromDate
      }

      if (additionalParams?.toDate) {
        combinedParams.toDate = additionalParams.toDate
      }

      const allData: NoteModel[] = await fetchPaginatedData(apiFunction, combinedParams)

      if (!allData || allData.length === 0) {
        return []
      }

      return allData
    })(),
  )
}
