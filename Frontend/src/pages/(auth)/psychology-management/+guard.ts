import type { GuardAsync } from 'vike/types'
import { getPermissionTypeName, PermissionType } from '#src/types/Enums/PermissionType.js'
import { render } from 'vike/abort'

const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  if (
    !pageContext.user?.permission.includes(
      getPermissionTypeName(PermissionType.ReadStudentPsychology),
    )
  ) {
    throw render(403)
  }
}
export { guard }
