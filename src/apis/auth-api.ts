import { axiosInstance } from '~/shared/config/axios-config'
import { createSwrMutation } from '~/shared/config/swr'
import { type NavRouteHrefType } from '~/shared/constants'
import {
  type AuthRegisterSchemaInput,
  type AuthSignSchemaInput
} from '~/shared/zod-schemas/auth.schema'
import { type CaptchaGetSchemaInput } from '~/shared/zod-schemas/captcha.schema'
import { type LoginVO } from '~/types/user-api'

// 登录api
const signApiUrl: NavRouteHrefType = '/api/auth/sign-in'
export const signInApi = (p: AuthSignSchemaInput) => {
  return axiosInstance.post<AuthSignSchemaInput, LoginVO>(signApiUrl, p)
}
export const useSignInSwrAPi = createSwrMutation<AuthSignSchemaInput, LoginVO>(
  signApiUrl,
  signInApi
)

// 注册api
const signUpApiUrl: NavRouteHrefType = '/api/auth/sign-up'
export function signUpApi(p: Omit<AuthRegisterSchemaInput, 'twoPassword'>) {
  return axiosInstance.post<Omit<AuthRegisterSchemaInput, 'twoPassword'>, LoginVO>(signUpApiUrl, p)
}
export const useSignUpSwrAPi = createSwrMutation<
  Omit<AuthRegisterSchemaInput, 'twoPassword'>,
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
  return axiosInstance.get<void, LoginVO>(signUserApiUrl)
}
export const useGetLoginUserSwrAPi = createSwrMutation<void, LoginVO>(
  signUserApiUrl,
  getLoginUserApi
)

// 获取验证码
const captchaApiUrl: NavRouteHrefType = '/api/auth/captcha'
export async function getCaptchaApi(p: CaptchaGetSchemaInput) {
  return fetch(captchaApiUrl, {
    method: 'POST',
    body: JSON.stringify(p)
  })
}
