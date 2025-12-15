import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { type NextRequest } from 'next/server'
import { verifyJwtToken } from '~/shared/utils/server'

/**
 * 获取当前上下文用户id
 *
 * @param request route 请求
 */
export async function getAuthUserId(request: NextRequest): Promise<string> {
  const jwtToken = request.cookies.get(COOKIE_AUTHORIZATION)?.value
  // 这里一定有验证过身份了，如果没有，在proxy.ts中已经被处理过了
  const payload = await verifyJwtToken(jwtToken!)
  const userId = payload?.userId
  if (!userId) {
    throw new Error('No user id')
  }
  return userId
}
