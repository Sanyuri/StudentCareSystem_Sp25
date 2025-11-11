import { MutableRefObject, useRef, useState } from 'react'

interface UsePaginationReturn {
  page: number
  pageSize: number
  pageSizeRef: MutableRefObject<number>
  handlePageChange: (newPage: number, newPageSize: number) => void
}

const usePagination = (
  initialPage: number = 1,
  initialPageSize: number = 10,
): UsePaginationReturn => {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const pageSizeRef: MutableRefObject<number> = useRef(initialPageSize)

  const handlePageChange = (newPage: number, newPageSize: number): void => {
    if (newPageSize !== pageSizeRef.current) {
      setPage(1)
      setPageSize(newPageSize)
    } else {
      setPage(newPage)
    }
    pageSizeRef.current = newPageSize
  }

  return {
    page,
    pageSize,
    pageSizeRef,
    handlePageChange,
  }
}

export default usePagination
