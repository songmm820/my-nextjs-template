import { axiosInstance } from '~/shared/config/axios-config'
import { createSwrMutation } from '~/shared/config/swr'
import { type NavRouteHrefType } from '~/shared/constants'
import {
  type AuthRegisterDTOSchema,
  type AuthSignDTOSchema
} from '~/shared/zod-schemas/auth.schema'
import { type CaptchaGetDTOSchema } from '~/shared/zod-schemas/captcha.schema'
import { type CurrentUserVO, type LoginVO } from '~/types/user-api'

// 登录api
const signApiUrl: NavRouteHrefType = '/api/auth/sign-in'
export const signInApi = (p: AuthSignDTOSchema) => {
  return axiosInstance.post<AuthSignDTOSchema, LoginVO>(signApiUrl, p)
}
export const useSignInSwrAPi = createSwrMutation<AuthSignDTOSchema, LoginVO>(
  signApiUrl,
  signInApi
)

// 注册api
const signUpApiUrl: NavRouteHrefType = '/api/auth/sign-up'
export function signUpApi(p: Omit<AuthRegisterDTOSchema, 'twoPassword'>) {
  return axiosInstance.post<Omit<AuthRegisterDTOSchema, 'twoPassword'>, LoginVO>(signUpApiUrl, p)
}
export const useSignUpSwrAPi = createSwrMutation<
  Omit<AuthRegisterDTOSchema, 'twoPassword'>,
  LoginVO
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
  return axiosInstance.get<void, CurrentUserVO>(signUserApiUrl)
}
export const useGetLoginUserSwrAPi = createSwrMutation<void, CurrentUserVO>(
  signUserApiUrl,
  getLoginUserApi
)

// 获取验证码
const captchaApiUrl: NavRouteHrefType = '/api/auth/captcha'
export async function getCaptchaApi(p: CaptchaGetDTOSchema) {
  return fetch(captchaApiUrl, {
    method: 'POST',
    body: JSON.stringify(p)
  })
}
