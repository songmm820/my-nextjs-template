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
export const signInApi = (p: AuthSignSchemaInput) => {
  const url: NavRouteHrefType = '/api/auth/sign-in'
  return axiosInstance.post<AuthSignSchemaInput, LoginVO>(url, p)
}
export const useSignInSwrAPi = createSwrMutation<AuthSignSchemaInput, LoginVO>(
  '/api/auth/sign-in',
  signInApi
)

// 注册api
export function signUpApi(p: Omit<AuthRegisterSchemaInput, 'twoPassword'>) {
  const url: NavRouteHrefType = '/api/auth/sign-up'
  return axiosInstance.post<Omit<AuthRegisterSchemaInput, 'twoPassword'>, LoginVO>(url, p)
}
export const useSignUpSwrAPi = createSwrMutation<
  Omit<AuthRegisterSchemaInput, 'twoPassword'>,
  LoginVO
>('/api/auth/sign-up', signUpApi)

// 退出登录
export async function signOutApi() {
  const url: NavRouteHrefType = '/api/auth/sign-out'
  return axiosInstance.post<void, void>(url)
}
export const useSignOutSwrAPi = createSwrMutation<void, void>('/api/auth/sign-out', signOutApi)

// 查询当前登录用户信息
export async function getLoginUserApi() {
  const url: NavRouteHrefType = '/api/auth/sign-user'
  return axiosInstance.get<void, LoginVO>(url)
}
export const useGetLoginUserSwrAPi = createSwrMutation<void, LoginVO>(
  '/api/auth/sign-user',
  getLoginUserApi
)

// 获取验证码
export async function getCaptchaApi(p: CaptchaGetSchemaInput) {
  const url: NavRouteHrefType = '/api/auth/captcha'
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(p)
  })
}
