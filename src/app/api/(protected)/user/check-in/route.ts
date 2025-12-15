import { NextResponse } from 'next/server'
import { CHECK_IN_EXPERIENCE } from '~/shared/constants'
import { dbUserCheckInById, dbUserIsCheckInToday } from '~/shared/db'
import { getAuthUserId } from '~/shared/lib/auth'
import { calculateLevelExp } from '~/shared/lib/level'
import { createApiHandler } from '~/shared/lib/route-handler'
import { HttpApiError, HttpResponse } from '~/shared/utils/server'
import { type UserExpOutputType } from '~/types/user-api'

// 用户签到
export const GET = createApiHandler(async (request) => {
  const userId = await getAuthUserId(request)
  const dbIsCheckIn = await dbUserIsCheckInToday(userId)
  if (dbIsCheckIn) {
    throw new HttpApiError('You have already checked in today')
  }
  const dbUserExp = await dbUserCheckInById(userId, CHECK_IN_EXPERIENCE)
  const useExoVo: UserExpOutputType = calculateLevelExp(dbUserExp.experience)
  return NextResponse.json(HttpResponse.success<UserExpOutputType>(useExoVo))
})
