export type StudentDeferRequest = {
  query: string
  semesters: string | undefined
  //filter?: DeferFilter
  pageNumber: number
  pageSize: number
}

export type DeferScanRequest = {
  semesterName: string
}
