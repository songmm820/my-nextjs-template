import { NextResponse } from 'next/server'
import { dbQueryUserCheckListInByMonth } from '~/shared/db'
import { getAuthUserId } from '~/shared/lib/auth'
import { createApiHandler } from '~/shared/lib/route-handler'
import { HttpApiError, HttpResponse } from '~/shared/utils/server'

// 查询用户签到信息
export const GET = createApiHandler(async (request) => {
  // 获取查询参数 month = 2023-10
  const { searchParams } = new URL(request.url)
  const monthQuery = searchParams.get('month')
  // 获取年月
  const [year, month] = monthQuery?.split('-') ?? []
  if (!year || !month) {
    throw new HttpApiError('The month parameter is error')
  }
  const userId = await getAuthUserId(request)
  const daysList = await dbQueryUserCheckListInByMonth(userId, Number(year), Number(month))
  return NextResponse.json(HttpResponse.success<Array<Date>>(daysList))
})
