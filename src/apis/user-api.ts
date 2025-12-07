import { axiosInstance } from '~/shared/config/axios-config'
import { createSwrMutation } from '~/shared/config/swr'
import {
  type UserProfileInfoUpdateSchemaInput,
  type UserConfigUpdateSchemaInput
} from '~/shared/zod-schemas/user.schema'
import { type UserExpVO, type UserConfigVO, type UserProfileInfoVO } from '~/types/user-api'

// 修改用户个人信息
const updateUserProfileApiUrl = '/api/user/profile'
const updateUserProfileApi = (p: UserProfileInfoUpdateSchemaInput) => {
  return axiosInstance.put<UserProfileInfoUpdateSchemaInput, UserProfileInfoVO>(
    updateUserProfileApiUrl,
    p
  )
}
export const useUpdateUserProfileSwrApi = createSwrMutation<
  UserProfileInfoUpdateSchemaInput,
  UserProfileInfoVO
>(updateUserProfileApiUrl, updateUserProfileApi)

// 修改用户配置
const updateUserConfigApiUrl = '/api/user/config'
const updateUserConfigApi = (p: UserConfigUpdateSchemaInput) => {
  return axiosInstance.put<UserConfigUpdateSchemaInput, UserConfigVO>(updateUserConfigApiUrl, p)
}
export const useUpdateUserConfigSwrApi = createSwrMutation<
  UserConfigUpdateSchemaInput,
  UserConfigVO
>(updateUserConfigApiUrl, updateUserConfigApi)

// 用户每日签到
const userDailyCheckInApiUrl = '/api/user/check-in'
const userDailyCheckInApi = () => {
  return axiosInstance.get<void, UserExpVO>(userDailyCheckInApiUrl)
}
export const useUserDailyCheckInSwrApi = createSwrMutation(
  userDailyCheckInApiUrl,
  userDailyCheckInApi
)
