import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { verifyJwtToken } from '~/shared/utils/internal/jwt'
import { clearSignUserRedis } from '~/apis/auth-redis'
import { HttpResponse } from '~/shared/utils/internal/http-response'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const jwtToken = request.cookies.get(COOKIE_AUTHORIZATION)?.value
  // 这里没有一定有jwt，如果没有，在proxy.ts中已经处理过了
  const payload = await verifyJwtToken(jwtToken!)
  const userId = payload?.userId
  // 清除登录状态
  await clearSignUserRedis(userId!)
  return NextResponse.json(HttpResponse.success())
}
