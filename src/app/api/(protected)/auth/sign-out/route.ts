import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse, verifyJwtToken } from '~/shared/utils/server'
import { redisDelSignUser } from '~/shared/db'

// 退出登录
export async function POST(request: NextRequest) {
  const jwtToken = request.cookies.get(COOKIE_AUTHORIZATION)?.value
  // 这里没有一定有jwt，如果没有，在proxy.ts中已经处理过了
  const payload = await verifyJwtToken(jwtToken!)
  const userId = payload?.userId
  // 清除登录状态
  await redisDelSignUser(userId!)
  return NextResponse.json(HttpResponse.success())
}
