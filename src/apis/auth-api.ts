import { axiosInstance } from '~/shared/config/axios-config'
import { createSwrMutation } from '~/shared/config/swr'
import { type NavRouteHrefType } from '~/shared/constants'
import {
  type AuthRegisterSchemaInput,
  type AuthSignSchemaInput
} from '~/shared/zod-schemas/auth.schema'
import { type SignInUserInfo } from '~/types/auth-api'
import { type CaptchaGetSchemaInput } from '~/shared/zod-schemas/captcha.schema'

// 登录api
export const signInApi = (p: AuthSignSchemaInput) => {
  const url: NavRouteHrefType = '/api/auth/sign-in'
  return axiosInstance.post<AuthSignSchemaInput, SignInUserInfo>(url, p)
}
export const useSignInSwrAPi = createSwrMutation<AuthSignSchemaInput, SignInUserInfo>(
  '/api/auth/sign-in',
  signInApi
)

// 注册api
export function signUpApi(p: Omit<AuthRegisterSchemaInput, 'twoPassword'>) {
  const url: NavRouteHrefType = '/api/auth/sign-up'
  return axiosInstance.post<Omit<AuthRegisterSchemaInput, 'twoPassword'>, SignInUserInfo>(url, p)
}
export const useSignUpSwrAPi = createSwrMutation<
  Omit<AuthRegisterSchemaInput, 'twoPassword'>,
  SignInUserInfo
>('/api/auth/sign-up', signUpApi)

// 获取验证码
export async function getCaptchaApi(p: CaptchaGetSchemaInput) {
  const url: NavRouteHrefType = '/api/auth/captcha'
  return axiosInstance
    .setHeaders('Content-Type', 'image/svg+xml')
    .post<CaptchaGetSchemaInput, Blob>(url, p)
  // return axiosInstance.post<CaptchaGetSchemaInput, Blob>(url, p)
}
export const useGetCaptchaSwrAPi = createSwrMutation<CaptchaGetSchemaInput, Blob>(
  '/api/auth/captcha',
  getCaptchaApi
)
