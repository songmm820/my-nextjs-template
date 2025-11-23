import { SysUser } from '~/generated/prisma/client'
import { axiosInstance } from '~/shared/lib/axios/request-config'

/**
 * 获取当前登录用户信息
 */
export function getUserSession() {
    const url = '/api/user'
    return axiosInstance.get<void, SysUser>(url)
}
