import { axiosInstance } from '~/shared/config/axios-config'
import { createSwrMutation } from '~/shared/config/swr'
import { type NavRouteHrefType } from '~/shared/constants'
import { type CaptchaGetInputType } from '~/shared/zod-schemas/captcha.schema'
import {
  type UserRegisterInputType,
  type UserSignInputType
} from '~/shared/zod-schemas/user.schema'
import { type UserLoginOutputType, type CurrentUserOutputType } from '~/types/user-api'

// 登录api
const signApiUrl: NavRouteHrefType = '/api/auth/sign-in'
export const signInApi = (p: UserSignInputType) => {
  return axiosInstance.post<UserSignInputType, UserLoginOutputType>(signApiUrl, p)
}
export const useSignInSwrAPi = createSwrMutation<UserSignInputType, UserLoginOutputType>(
  signApiUrl,
  signInApi
)

// 注册api
const signUpApiUrl: NavRouteHrefType = '/api/auth/sign-up'
export function signUpApi(p: Omit<UserRegisterInputType, 'twoPassword'>) {
  return axiosInstance.post<Omit<UserRegisterInputType, 'twoPassword'>, UserLoginOutputType>(
    signUpApiUrl,
    p
  )
}
export const useSignUpSwrAPi = createSwrMutation<
  Omit<UserRegisterInputType, 'twoPassword'>,
  UserLoginOutputType
>(signUpApiUrl, signUpApi)

// 退出登录
const signOutApiUrl: NavRouteHrefType = '/api/auth/sign-out'
export async function signOutApi() {
  return axiosInstance.post<void, void>(signOutApiUrl)
}
export const useSignOutSwrAPi = createSwrMutation<void, void>(signOutApiUrl, signOutApi)

// 查询当前登录用户信息
const signUserApiUrl: NavRouteHrefType = '/api/auth/sign-user'
export async function getLoginUserApi() {
  return axiosInstance.get<void, CurrentUserOutputType>(signUserApiUrl)
}
export const useGetLoginUserSwrAPi = createSwrMutation<void, CurrentUserOutputType>(
  signUserApiUrl,
  getLoginUserApi
)

// 获取验证码
const captchaApiUrl: NavRouteHrefType = '/api/auth/captcha'
export async function getCaptchaApi(p: CaptchaGetInputType) {
  return fetch(captchaApiUrl, {
    method: 'POST',
    body: JSON.stringify(p)
  })
}
