import { axiosInstance } from '~/shared/config/axios-config'
import { type NavRouteHrefType } from '~/shared/constants'
import { type AuthSignSchemaInput } from '~/shared/zod-schemas/auth.schema'

/**
 * 登录api
 */
export function signInApi(p: AuthSignSchemaInput) {
  const url: NavRouteHrefType = '/api/auth/sign-in'
  return axiosInstance.post<AuthSignSchemaInput, string>(url, p)
}
