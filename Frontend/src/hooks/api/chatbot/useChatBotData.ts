import { AIService } from '#src/services/AIService.js'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useChatBotData = (userId?: string) => {
  return useQuery({
    queryKey: ['chatbot'],
    queryFn: () => AIService.getChat(userId),
    enabled: !!userId,
    placeholderData: keepPreviousData,
  })
}
