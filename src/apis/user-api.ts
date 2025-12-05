import { axiosInstance } from '~/shared/config/axios-config'
import { createSwrMutation } from '~/shared/config/swr'
import { type UserConfigUpdateSchemaInput } from '~/shared/zod-schemas/user.schema'

// 修改用户配置
const updateUserConfigApiUrl = '/api/user/config'
const updateUserConfigApi = (p: UserConfigUpdateSchemaInput) => {
  return axiosInstance.put<UserConfigUpdateSchemaInput, UserConfigUpdateSchemaInput>(
    updateUserConfigApiUrl,
    p
  )
}
export const useUpdateUserConfigSwrApi = createSwrMutation<
  UserConfigUpdateSchemaInput,
  UserConfigUpdateSchemaInput
>(updateUserConfigApiUrl, updateUserConfigApi)

// 用户每日签到
const userDailyCheckInApiUrl = '/api/user/check-in'
const userDailyCheckInApi = () => {
  return axiosInstance.get<void, void>(userDailyCheckInApiUrl)
}
export const useUserDailyCheckInSwrApi = createSwrMutation(
  userDailyCheckInApiUrl,
  userDailyCheckInApi
)
