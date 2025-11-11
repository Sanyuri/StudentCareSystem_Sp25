import { EmailLogService } from '#src/services/EmailLogService.js'
import { EmailLogRequest } from '#src/types/RequestModel/EmailLogRequest.js'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

// Hook to fetch all email logs with filters
export const useEmailLogsData = (filter: EmailLogRequest) => {
  return useQuery({
    queryKey: ['email-logs', filter], // Query key with filter
    queryFn: () => EmailLogService.getAll(filter), // Fetch function
    placeholderData: keepPreviousData, // Placeholder data for when loading
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
  })
}

// Hook to fetch email log by ID
export const useEmailLogById = (id: string) => {
  return useQuery({
    queryKey: ['email-log', id], // Query key with ID
    queryFn: () => EmailLogService.getById(id), // Fetch function
    placeholderData: keepPreviousData, // Placeholder data for when loading
    enabled: !!id, // Only fetch when ID is provided
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  })
}
