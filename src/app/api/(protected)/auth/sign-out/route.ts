import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse } from '~/shared/utils/server'
import { redisDelSignUser } from '~/shared/db'
import { getAuthUserId } from '~/shared/lib/auth'

// 退出登录
export async function POST(request: NextRequest) {
  const userId = await getAuthUserId(request)
  // 清除登录状态
  await redisDelSignUser(userId)
  return NextResponse.json(HttpResponse.success())
}
