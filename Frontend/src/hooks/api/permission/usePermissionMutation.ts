import PermissionService from '#src/services/PermissionService.js'
import { useGenericMutation } from '../useGenericMutation'

export const useAutoSetPermissionMutation = () => {
  return useGenericMutation<unknown, unknown>(
    async (): Promise<void> => {
      return await PermissionService.autoSetPermission()
    },
    'PERMISSIONS.TOAST.SUCCESS.EDIT',
    'PERMISSIONS.TOAST.ERROR.EDIT',
    ['AccountData', 'listAllPermission', 'listPermissionByRole'],
  )
}
