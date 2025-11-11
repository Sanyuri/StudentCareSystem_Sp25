import { PermissionService } from '#src/services/PermissionService.js'

import { useQuery } from '@tanstack/react-query'

export const usePermission = () => {
  return useQuery({
    queryKey: ['listAllPermission'],
    queryFn: () => PermissionService.getAllPermission(),
  })
}

export const usePermissionByRole = (role: string | undefined) => {
  return useQuery({
    queryKey: ['listPermissionByRole', role],
    queryFn: () => PermissionService.getPermissionByRole(role),
    enabled: !!role,
  })
}
