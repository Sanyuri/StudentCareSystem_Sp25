import { TenantService } from '#src/services/TenantService.js'
import { useQuery } from '@tanstack/react-query'

export const useTenantData = () => {
  return useQuery({
    queryKey: ['tenantData'],
    queryFn: () => TenantService.getAllTenants(),
    staleTime: 5000,
  })
}
