import { AIService } from '#src/services/AIService.js'
import { ChatBotRequest } from '#src/types/RequestModel/ChatBotRequest.js'
import { ChatBotResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { useGenericMutation } from '../useGenericMutation'

export const useChatBotMutation = () => {
  return useGenericMutation<ChatBotRequest, ChatBotResponse>(
    async (chatbotRequest: ChatBotRequest): Promise<ChatBotResponse> => {
      return await AIService.postChat(chatbotRequest)
    },
    null, // Success toast translation key
    null, // Error toast translation key
    [], // Query keys to invalidate
    undefined, // Options (passing undefined since we don't need custom options)
    false, // needLoading parameter
  )
}
