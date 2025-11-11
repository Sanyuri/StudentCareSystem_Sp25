import { RoleService } from '#src/services/RoleService.js'
import { useQuery } from '@tanstack/react-query'

export const useRole = () => {
  return useQuery({
    queryKey: ['listAllRoles'],
    queryFn: () => RoleService.getAllRoles(),
  })
}

export const useRolePermission = (param: string | undefined) => {
  return useQuery({
    queryKey: ['listRolePermission'],
    queryFn: () => RoleService.getRolePermission(param),
    enabled: !!param,
  })
}
