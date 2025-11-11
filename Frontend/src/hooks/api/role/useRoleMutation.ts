import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import { UpdateRolePermission } from '#types/RequestModel/ApiRequest.js'
import { RoleService } from '#src/services/RoleService.js'

export const useUpdateRoleMutation = () => {
  return useGenericMutation<{ id: string; updateData: UpdateRolePermission }, unknown>(
    async ({ id, updateData }: { id: string; updateData: UpdateRolePermission }): Promise<void> => {
      return await RoleService.updateRolePermission(id, updateData)
    },
    'PERMISSIONS.TOAST.SUCCESS.EDIT',
    'PERMISSIONS.TOAST.ERROR.EDIT',
    ['listRolePermission', 'listAllRoles', 'listAllPermission', 'listAllPermission'],
  )
}
