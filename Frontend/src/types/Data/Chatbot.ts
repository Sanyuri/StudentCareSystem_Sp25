export type ChatBotData = {
  type: string
  content: string
  id: string
  additional_kwargs: Record<string, never>
  response_metadata: Record<string, never>
  usage_metadata?: Record<string, never>
  tool_calls?: []
}
