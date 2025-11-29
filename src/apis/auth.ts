import { axiosInstance } from '~/shared/config/axios-config'
import { type NavRouteHrefType } from '~/shared/constants'
import {
  type AuthRegisterSchemaInput,
  type AuthSignSchemaInput
} from '~/shared/zod-schemas/auth.schema'
import { type SignInUserInfo } from '~/types/auth-api'

// 登录api
export function signInApi(p: AuthSignSchemaInput) {
  const url: NavRouteHrefType = '/api/auth/sign-in'
  return axiosInstance.post<AuthSignSchemaInput, SignInUserInfo>(url, p)
}

// 注册api
export function signUpApi(p: Omit<AuthRegisterSchemaInput, 'twoPassword'>) {
  const url: NavRouteHrefType = '/api/auth/sign-up'
  return axiosInstance.post<Omit<AuthRegisterSchemaInput, 'twoPassword'>, SignInUserInfo>(url, p)
}
