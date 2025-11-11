import { useQuery } from '@tanstack/react-query'
import SemesterService from '#src/services/SemesterService.js'

export const useSemesterData = () => {
  return useQuery({
    queryKey: ['listAllSemester'],
    queryFn: () => SemesterService.getAllSemesters(),
  })
}

export const useCurrentSemesterData = () => {
  return useQuery({
    queryKey: ['currentSemester'],
    queryFn: () => SemesterService.getCurrentSemesters(),
  })
}
