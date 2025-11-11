import { BaseService } from './BaseService'
import { TEST_URL } from '#utils/constants/api.js'

export const TestService = {
  test(value: object): Promise<void> {
    return BaseService.post<void>(TEST_URL, value)
  },
}
