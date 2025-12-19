import { axiosInstance } from '~/shared/config/axios-config'
import { createSwrMutation } from '~/shared/config/swr'
import {
  type UserUpdateConfigInputType,
  type UserUpdateInputType
} from '~/shared/zod-schemas/user.schema'
import {
  type UserBaseInfoOutputType,
  type UserConfigOutputType,
  type UserExpOutputType
} from '~/types/user-api'

// 修改用户个人信息
const updateUserProfileApiUrl = '/api/user/profile'
const updateUserProfileApi = (p: UserUpdateInputType) => {
  return axiosInstance.put<UserUpdateInputType, UserBaseInfoOutputType>(updateUserProfileApiUrl, p)
}
export const useUpdateUserProfileSwrApi = createSwrMutation<
  UserUpdateInputType,
  UserBaseInfoOutputType
>(updateUserProfileApiUrl, updateUserProfileApi)

// 修改用户配置
const updateUserConfigApiUrl = '/api/user/config'
const updateUserConfigApi = (p: UserUpdateConfigInputType) => {
  return axiosInstance.put<UserUpdateConfigInputType, UserConfigOutputType>(
    updateUserConfigApiUrl,
    p
  )
}
export const useUpdateUserConfigSwrApi = createSwrMutation<
  UserUpdateConfigInputType,
  UserConfigOutputType
>(updateUserConfigApiUrl, updateUserConfigApi)

// 用户每日签到
const userDailyCheckInApiUrl = '/api/user/check-in'
const userDailyCheckInApi = () => {
  return axiosInstance.get<void, UserExpOutputType>(userDailyCheckInApiUrl)
}
export const useUserDailyCheckInSwrApi = createSwrMutation(
  userDailyCheckInApiUrl,
  userDailyCheckInApi
)

// 获取用户某年月签到记录
const userCheckInRecordApiUrl = '/api/user/check-record'
const userCheckInRecordApi = (p: { month: string }) => {
  return axiosInstance.get<{ month: string }, Array<Date>>(userCheckInRecordApiUrl, p)
}
export const useUserCheckInRecordSwrApi = createSwrMutation(
  userCheckInRecordApiUrl,
  userCheckInRecordApi
)
