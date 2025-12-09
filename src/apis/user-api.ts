import { axiosInstance } from '~/shared/config/axios-config'
import { createSwrMutation } from '~/shared/config/swr'
import {
  type UserProfileInfoUpdateDTOSchema,
  type UserConfigUpdateDTOSchema
} from '~/shared/zod-schemas/user.schema'
import { type UserExpVO, type UserConfigVO, type UserProfileInfoVO } from '~/types/user-api'

// 修改用户个人信息
const updateUserProfileApiUrl = '/api/user/profile'
const updateUserProfileApi = (p: UserProfileInfoUpdateDTOSchema) => {
  return axiosInstance.put<UserProfileInfoUpdateDTOSchema, UserProfileInfoVO>(
    updateUserProfileApiUrl,
    p
  )
}
export const useUpdateUserProfileSwrApi = createSwrMutation<
  UserProfileInfoUpdateDTOSchema,
  UserProfileInfoVO
>(updateUserProfileApiUrl, updateUserProfileApi)

// 修改用户配置
const updateUserConfigApiUrl = '/api/user/config'
const updateUserConfigApi = (p: UserConfigUpdateDTOSchema) => {
  return axiosInstance.put<UserConfigUpdateDTOSchema, UserConfigVO>(updateUserConfigApiUrl, p)
}
export const useUpdateUserConfigSwrApi = createSwrMutation<
  UserConfigUpdateDTOSchema,
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
