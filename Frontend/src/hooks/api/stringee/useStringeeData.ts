import { StringeeService } from '#src/services/StringeeService.js'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useStringeeData = () => {
  return useQuery({
    queryKey: ['stringee'],
    queryFn: () => StringeeService.getToken(),
    placeholderData: keepPreviousData,
    enabled: false,
  })
}
