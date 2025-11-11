import { render } from 'vike/abort'
import { GuardAsync } from 'vike/types'
import { getPermissionTypeName, PermissionType } from '#src/types/Enums/PermissionType.js'

const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  if (
    !pageContext.user?.permission.includes(getPermissionTypeName(PermissionType.ReadStudentDefer))
  ) {
    throw render(403)
  }
}
export { guard }
