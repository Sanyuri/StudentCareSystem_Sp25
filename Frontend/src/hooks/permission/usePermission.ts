import { getPermissionTypeName, PermissionType } from '#src/types/Enums/PermissionType.js'
import { usePageContext } from 'vike-react/usePageContext'
import { PageContext } from 'vike/types'

export const useCheckPermission = () => {
  const pageContext: PageContext = usePageContext()

  const hasPermission = (permissionType: PermissionType): boolean => {
    return pageContext.user?.permission?.includes(getPermissionTypeName(permissionType)) ?? false
  }

  return { hasPermission }
}
