import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AIService } from '#src/services/AIService.js'

export const useAISettingData = () => {
  return useQuery({
    queryKey: ['ai-settings'],
    queryFn: () => AIService.getCurrentAgent(),
    placeholderData: keepPreviousData,
  })
}
