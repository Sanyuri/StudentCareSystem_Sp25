import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AppSettingService } from '#src/services/AppSettingService.js'

export const useAppSettingData = () => {
  return useQuery({
    queryKey: ['app-settings'],
    queryFn: () => AppSettingService.getAll(),
    placeholderData: keepPreviousData,
  })
}
